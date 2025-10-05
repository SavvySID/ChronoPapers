import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/prisma'
import { ApiResponse } from '@/types'

// Ensure this API route runs on Node.js runtime and is not statically optimized
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
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

    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data: {
        id: paper.id,
        title: paper.title,
        author: paper.author,
        abstract: paper.abstract,
        CID: paper.CID,
        version: paper.version,
        timestamp: paper.timestamp.toISOString(),
        parentCID: paper.parentCID || undefined,
        fileSize: paper.fileSize || undefined,
        fileType: paper.fileType || undefined,
        keywords: paper.keywords ? JSON.parse(paper.keywords) : [],
        doi: paper.doi || undefined,
        isVerified: paper.isVerified
      }
    })

  } catch (error) {
    console.error('Get paper error:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to retrieve paper'
    }, { status: 500 })
  }
}
