import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/activities/[id]
 * Get activity by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: params.id },
      include: {
        submissions: {
          select: {
            id: true,
            userId: true,
            status: true,
            score: true,
            submittedDate: true,
          },
        },
      },
    })

    if (!activity) {
      return NextResponse.json(
        { success: false, error: 'Activity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: activity,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activity' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/activities/[id]
 * Update activity (Admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, maxScore, gradeLevel, startDate, endDate } =
      body

    const activity = await prisma.activity.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(maxScore && { maxScore }),
        ...(gradeLevel && { gradeLevel }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Activity updated successfully',
      data: activity,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update activity' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/activities/[id]
 * Delete activity (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.activity.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Activity deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete activity' },
      { status: 500 }
    )
  }
}
