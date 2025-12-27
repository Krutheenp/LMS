import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/activities
 * Get all activities with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.activity.count(),
    ])

    return NextResponse.json({
      success: true,
      data: activities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/activities
 * Create new activity (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, maxScore, gradeLevel, startDate, endDate } =
      body

    if (!title || !maxScore || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        maxScore,
        gradeLevel: gradeLevel || 'A',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Activity created successfully',
        data: activity,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}
