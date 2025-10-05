import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { filecoinStorage } from '@/lib/filecoin'
import { ResearchPaper, UploadMetadata, SearchFilters, ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const metadata = JSON.parse(formData.get('metadata') as string) as UploadMetadata

    if (!file) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'No file provided'
      }, { status: 400 })
    }

    // Upload to Filecoin using Synapse SDK
    let uploadResult
    try {
      uploadResult = await filecoinStorage.uploadFile(file)
    } catch (error) {
      console.error('Filecoin upload error:', error)
      
      // Check if it's a configuration error
      if (error.message.includes('Filecoin private key not configured')) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: 'Filecoin configuration missing. Please configure your private key in .env.local to upload papers to Filecoin network.'
        }, { status: 400 })
      } else if (error.message.includes('Failed to initialize Synapse')) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: 'Unable to connect to Filecoin network. Please check your internet connection and configuration.'
        }, { status: 500 })
      } else {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: `Upload failed: ${error.message}`
        }, { status: 500 })
      }
    }
    
    const cid = uploadResult.cid
    
    // Store metadata in database
    const paper = await prisma.researchPaper.create({
      data: {
        title: metadata.title,
        author: metadata.author,
        abstract: metadata.abstract,
        CID: cid,
        keywords: JSON.stringify(metadata.keywords || []),
        doi: metadata.doi,
        fileSize: file.size,
        fileType: file.type,
        version: 1,
        isVerified: false
      }
    })

    return NextResponse.json<ApiResponse<ResearchPaper>>({
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
      },
      message: 'Paper uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to upload paper'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const author = searchParams.get('author') || ''
    const verified = searchParams.get('verified')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { abstract: { contains: query, mode: 'insensitive' } },
        { author: { contains: query, mode: 'insensitive' } }
      ]
    }

    if (author) {
      where.author = { contains: author, mode: 'insensitive' }
    }

    if (verified !== null && verified !== undefined) {
      where.isVerified = verified === 'true'
    }

    const [papers, total] = await Promise.all([
      prisma.researchPaper.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.researchPaper.count({ where })
    ])

    const formattedPapers: ResearchPaper[] = papers.map((paper: any) => ({
      id: paper.id,
      title: paper.title,
      author: paper.author,
      abstract: paper.abstract,
      CID: paper.CID,
      version: paper.version,
      timestamp: paper.timestamp.toISOString(),
      parentCID: paper.parentCID,
      fileSize: paper.fileSize,
      fileType: paper.fileType,
      keywords: paper.keywords ? JSON.parse(paper.keywords) : [],
      doi: paper.doi,
      isVerified: paper.isVerified
    }))

    return NextResponse.json<ApiResponse<{
      papers: ResearchPaper[]
      total: number
      page: number
      limit: number
    }>>({
      success: true,
      data: {
        papers: formattedPapers,
        total,
        page,
        limit
      }
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Failed to search papers'
    }, { status: 500 })
  }
}
