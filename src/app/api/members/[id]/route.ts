import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/members/[id]
 * Get member details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const member = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        submissions: {
          include: {
            activity: {
              select: {
                id: true,
                title: true,
                maxScore: true,
                gradeLevel: true,
              },
            },
          },
          orderBy: { updatedAt: 'desc' },
        },
        badges: {
          include: {
            activity: {
              select: { id: true, title: true },
            },
          },
        },
      },
    })

    if (!member) {
      return NextResponse.json(
        { success: false, error: 'Member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: member,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch member' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/members/[id]
 * Update member (Admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, email } = body

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        totalScore: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Member updated successfully',
      data: user,
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update member' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/members/[id]
 * Delete member (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Member deleted successfully',
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete member' },
      { status: 500 }
    )
  }
}
