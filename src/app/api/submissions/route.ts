import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/submissions
 * Create submission for an activity
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, activityId, fileUrls } = body

    if (!userId || !activityId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if activity exists
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    })

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      )
    }

    // Create or update submission
    const submission = await prisma.submission.upsert({
      where: {
        userId_activityId: {
          userId,
          activityId,
        },
      },
      update: {
        status: 'SUBMITTED',
        submittedDate: new Date(),
        fileUrls: fileUrls || [],
      },
      create: {
        userId,
        activityId,
        status: 'SUBMITTED',
        submittedDate: new Date(),
        fileUrls: fileUrls || [],
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Submission created successfully',
        data: submission,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create submission' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/submissions
 * Get submissions with filters
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const activityId = searchParams.get('activityId')
    const status = searchParams.get('status')

    const submissions = await prisma.submission.findMany({
      where: {
        ...(userId && { userId }),
        ...(activityId && { activityId }),
        ...(status && { status: status as any }),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        activity: {
          select: { id: true, title: true, maxScore: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: submissions,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}
