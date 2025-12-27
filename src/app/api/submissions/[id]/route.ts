import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/submissions/[id]
 * Get submission by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        activity: { select: { id: true, title: true, maxScore: true } },
      },
    })

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: submission,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch submission' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/submissions/[id]
 * Update submission (approve/reject with grading)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, score, comments } = body

    const submission = await prisma.submission.update({
      where: { id: params.id },
      data: {
        status: status || undefined,
        score: score !== undefined ? score : undefined,
        comments: comments || undefined,
        approvalDate: status === 'APPROVED' ? new Date() : undefined,
      },
    })

    // If approved, create badge
    if (status === 'APPROVED' && score !== undefined) {
      await prisma.badge.upsert({
        where: {
          userId_activityId: {
            userId: submission.userId,
            activityId: submission.activityId,
          },
        },
        update: { points: score },
        create: {
          userId: submission.userId,
          activityId: submission.activityId,
          points: score,
          earnedDate: new Date(),
        },
      })

      // Update user total score
      const badges = await prisma.badge.aggregate({
        where: { userId: submission.userId },
        _sum: { points: true },
      })

      await prisma.user.update({
        where: { id: submission.userId },
        data: { totalScore: badges._sum.points || 0 },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Submission updated successfully',
      data: submission,
    })
  } catch (error) {
    console.error('Update submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}
