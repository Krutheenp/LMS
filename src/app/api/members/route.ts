import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/members
 * Get all members (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: 'MEMBER',
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          totalScore: true,
          level: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { totalScore: 'desc' },
      }),
      prisma.user.count({
        where: {
          role: 'MEMBER',
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ],
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: members,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/members
 * Create new member (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if email exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      )
    }

    // In production, hash password with bcrypt
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // Should be hashed
        role: 'MEMBER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Member created successfully',
        data: user,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create member' },
      { status: 500 }
    )
  }
}
