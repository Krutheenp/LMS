// ===== API Response/Request Types =====

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ===== Activity API =====

export interface CreateActivityRequest {
  title: string
  description?: string
  maxScore: number
  gradeLevel: string
  startDate: string
  endDate: string
}

export interface UpdateActivityRequest extends Partial<CreateActivityRequest> {
  id: string
}

// ===== Submission API =====

export interface SubmitActivityRequest {
  activityId: string
  fileUrls: string[]
  notes?: string
}

export interface ApproveSubmissionRequest {
  submissionId: string
  score: number
  comments?: string
}

export interface RejectSubmissionRequest {
  submissionId: string
  comments: string
}

// ===== Authentication =====

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  role?: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

// ===== File Upload =====

export interface FileUploadResponse {
  url: string
  filename: string
  size: number
  mimetype: string
}
