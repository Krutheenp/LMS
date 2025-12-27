import { prisma } from '@/lib/db'

/**
 * Activity Service - ดึงข้อมูลกิจกรรม
 */
export const activityService = {
  // ดึงกิจกรรมทั้งหมด
  async getAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit
    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.activity.count(),
    ])
    return { activities, total, page, limit }
  },

  // ดึงกิจกรรมตามรหัส
  async getById(id: string) {
    return prisma.activity.findUnique({
      where: { id },
      include: { submissions: true, badges: true },
    })
  },

  // สร้างกิจกรรมใหม่
  async create(data: any) {
    return prisma.activity.create({ data })
  },

  // อัปเดตกิจกรรม
  async update(id: string, data: any) {
    return prisma.activity.update({ where: { id }, data })
  },

  // ลบกิจกรรม
  async delete(id: string) {
    return prisma.activity.delete({ where: { id } })
  },
}

/**
 * User Service - ดึงข้อมูลผู้ใช้
 */
export const userService = {
  // ดึงผู้ใช้ทั้งหมด
  async getAllMembers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { role: 'MEMBER' },
        skip,
        take: limit,
        orderBy: { totalScore: 'desc' },
      }),
      prisma.user.count({ where: { role: 'MEMBER' } }),
    ])
    return { users, total, page, limit }
  },

  // ดึงผู้ใช้ตามรหัส
  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        submissions: { include: { activity: true } },
        badges: { include: { activity: true } },
      },
    })
  },

  // สร้างผู้ใช้ใหม่
  async create(data: any) {
    return prisma.user.create({ data })
  },

  // อัปเดตผู้ใช้
  async update(id: string, data: any) {
    return prisma.user.update({ where: { id }, data })
  },

  // ลบผู้ใช้
  async delete(id: string) {
    return prisma.user.delete({ where: { id } })
  },
}

/**
 * Submission Service - ดึงข้อมูลการส่ง
 */
export const submissionService = {
  // ดึงการส่งทั้งหมด
  async getAll(filters: any = {}) {
    return prisma.submission.findMany({
      where: filters,
      include: {
        user: { select: { id: true, name: true } },
        activity: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  // ดึงการส่งตามรหัส
  async getById(id: string) {
    return prisma.submission.findUnique({
      where: { id },
      include: {
        user: true,
        activity: true,
      },
    })
  },

  // สร้างการส่ง
  async create(data: any) {
    return prisma.submission.create({ data })
  },

  // อัปเดตการส่ง
  async update(id: string, data: any) {
    return prisma.submission.update({ where: { id }, data })
  },

  // อนุมัติการส่ง
  async approve(id: string, score: number, comments?: string) {
    return prisma.submission.update({
      where: { id },
      data: {
        status: 'APPROVED',
        score,
        comments,
        approvalDate: new Date(),
      },
    })
  },

  // ปฏิเสธการส่ง
  async reject(id: string, comments?: string) {
    return prisma.submission.update({
      where: { id },
      data: {
        status: 'REJECTED',
        comments,
        approvalDate: new Date(),
      },
    })
  },
}

/**
 * Badge Service - ดึงข้อมูลแบดจ์
 */
export const badgeService = {
  // ดึงแบดจ์ของผู้ใช้
  async getUserBadges(userId: string) {
    return prisma.badge.findMany({
      where: { userId },
      include: { activity: true },
      orderBy: { earnedDate: 'desc' },
    })
  },

  // ดึงแบดจ์ของกิจกรรม
  async getActivityBadges(activityId: string) {
    return prisma.badge.findMany({
      where: { activityId },
      include: { user: { select: { id: true, name: true } } },
    })
  },

  // สร้างแบดจ์
  async create(data: any) {
    return prisma.badge.create({ data })
  },
}
