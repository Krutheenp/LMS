// ===== Grade Criteria =====

export const GRADE_CRITERIA = {
  A: { min: 90, max: 100, label: 'ดีเยี่ยม (ทอง)', color: '#fbbf24' },
  B: { min: 80, max: 89, label: 'ดี (เงิน)', color: '#d1d5db' },
  C: { min: 70, max: 79, label: 'พอใจ (ทองแดง)', color: '#d97706' },
  D: { min: 60, max: 69, label: 'ผ่าน', color: '#6b7280' },
  F: { min: 0, max: 59, label: 'ไม่ผ่าน', color: '#ef4444' },
}

// ===== Member Levels =====

export const MEMBER_LEVELS = {
  BEGINNER: { label: 'ผู้เริ่มต้น', icon: '🌱', minScore: 0 },
  INTERMEDIATE: { label: 'ระดับกลาง', icon: '🌿', minScore: 500 },
  ADVANCED: { label: 'ระดับสูง', icon: '🌳', minScore: 1500 },
  EXPERT: { label: 'ผู้เชี่ยวชาญ', icon: '👑', minScore: 3000 },
}

// ===== Submission Status =====

export const SUBMISSION_STATUS = {
  NOT_STARTED: { label: 'ยังไม่เริ่ม', color: '#9ca3af', badge: 'secondary' },
  SUBMITTED: { label: 'รอการอนุมัติ', color: '#f59e0b', badge: 'warning' },
  APPROVED: { label: 'อนุมัติแล้ว', color: '#10b981', badge: 'success' },
  REJECTED: { label: 'ปฏิเสธ', color: '#ef4444', badge: 'danger' },
}

// ===== File Upload =====

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
]

// ===== Routes =====

export const ROUTES = {
  // Public
  LOGIN: '/login',
  REGISTER: '/register',

  // Member
  DASHBOARD: '/',
  PROFILE: '/profile',
  ACTIVITIES: '/activities',
  ACTIVITY_DETAIL: '/activities/:id',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_MEMBERS: '/admin/members',
  ADMIN_MEMBER_DETAIL: '/admin/members/:id',
  ADMIN_ACTIVITIES: '/admin/activities',
  ADMIN_REVIEWS: '/admin/reviews',
}

// ===== Pagination =====

export const DEFAULT_PAGE_SIZE = 10
export const ADMIN_TABLE_PAGE_SIZE = 20

// ===== System Config =====

export const SYSTEM_CONFIG = {
  TOTAL_MEMBERS: 600,
  TOTAL_ACTIVITIES: 50,
  MAX_FILE_ATTACHMENTS: 5,
  SESSION_TIMEOUT: 24 * 60 * 60, // 24 hours in seconds
}
