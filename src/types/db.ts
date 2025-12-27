// ===== Database Types (Match Prisma Schema) =====

export type UserRole = 'MEMBER' | 'ADMIN'
export type SubmissionStatus = 'NOT_STARTED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
export type GradeLevel = 'A' | 'B' | 'C' | 'D' | 'F'
export type MemberLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  profileImage?: string
  totalScore: number
  level: MemberLevel
  createdAt: Date
  updatedAt: Date
}

export interface Activity {
  id: string
  title: string
  description?: string
  maxScore: number
  gradeLevel: GradeLevel
  startDate: Date
  endDate: Date
  createdAt: Date
  updatedAt: Date
}

export interface Submission {
  id: string
  userId: string
  activityId: string
  status: SubmissionStatus
  submittedDate?: Date
  approvalDate?: Date
  score?: number
  comments?: string
  fileUrls: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Badge {
  id: string
  userId: string
  activityId: string
  earnedDate: Date
  points: number
  createdAt: Date
  updatedAt: Date
}

export interface ActivityProgress {
  id: string
  userId: string
  activityId: string
  completionPercentage: number
  lastUpdated: Date
}

// ===== Extended Types (with relations) =====

export interface UserWithSubmissions extends User {
  submissions: Submission[]
  badges: Badge[]
}

export interface ActivityWithSubmissions extends Activity {
  submissions: Submission[]
  badges: Badge[]
}
