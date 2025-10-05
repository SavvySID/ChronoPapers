import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { filecoinStorage } from '@/lib/filecoin'
import { ApiResponse } from '@/types'

// Ensure this API route runs on Node.js runtime and is not statically optimized
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prisma = getPrisma()
    const paper = await prisma.researchPaper.findUnique({
      where: { id: params.id }
    })

    if (!paper) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Paper not found'
      }, { status: 404 })
    }

    // Perform actual PDP verification using Filecoin storage
    let isValid: boolean
    let message: string
    
    try {
      isValid = await filecoinStorage.verifyFile(paper.CID)
      message = isValid 
        ? 'Paper verification successful - data integrity confirmed on Filecoin network'
        : 'Paper verification failed - data may be corrupted or missing'
    } catch (error) {
      console.error('Filecoin verification error:', error)
      
      // Check if it's a configuration error
      if (error.message.includes('Must provide exactly one of: privateKey, provider, or signer')) {
        isValid = false
        message = 'Verification failed - Filecoin configuration missing. Please configure your private key in .env.local'
      } else if (error.message.includes('Failed to initialize Synapse')) {
        isValid = false
        message = 'Verification failed - unable to connect to Filecoin network. Check your RPC URL configuration.'
      } else {
        isValid = false
        message = `Verification failed - ${error.message}`
      }
    }

    // Update verification status
    const updatedPaper = await prisma.researchPaper.update({
      where: { id: params.id },
      data: { isVerified: isValid }
    })

    // Store verification proof
    await prisma.pDPProof.create({
      data: {
        paperId: paper.id,
        CID: paper.CID,
        proof: isValid ? `verified-proof-${Date.now()}-${paper.CID.slice(-8)}` : `failed-proof-${Date.now()}`,
        isValid
      }
    })

    return NextResponse.json<ApiResponse<{
      isValid: boolean
      message: string
    }>>({
      success: true,
      data: {
        isValid,
        message
      }
    })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to verify paper'
    }, { status: 500 })
  }
}
