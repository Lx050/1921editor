import api from '../utils/api'

// ==================== 类型定义 ====================

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  name: string
  inviteCode: string
}

export interface VerifyEmailDto {
  token: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  token: string
  newPassword: string
}

export interface ChangePasswordDto {
  oldPassword: string
  newPassword: string
}

export interface AuthResponse {
  accessToken: string
  user: {
    id: string
    email: string
    name: string
    role: string
    tenantId: string
    emailVerified: boolean
  }
  tenant: {
    id: string
    name: string
    slug: string
  }
}

// ==================== 认证 API ====================

/**
 * 用户注册
 */
export const register = async (dto: RegisterDto): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', dto)
  return response.data
}

/**
 * 验证邮箱
 */
export const verifyEmail = async (dto: VerifyEmailDto): Promise<{ message: string }> => {
  const response = await api.post('/auth/verify-email', dto)
  return response.data
}

/**
 * 邮箱密码登录
 */
export const login = async (dto: LoginDto): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', dto)
  return response.data
}

/**
 * 请求密码重置
 */
export const forgotPassword = async (dto: ForgotPasswordDto): Promise<{ message: string }> => {
  const response = await api.post('/auth/forgot-password', dto)
  return response.data
}

/**
 * 重置密码
 */
export const resetPassword = async (dto: ResetPasswordDto): Promise<{ message: string }> => {
  const response = await api.post('/auth/reset-password', dto)
  return response.data
}

/**
 * 修改密码 (需认证)
 */
export const changePassword = async (dto: ChangePasswordDto): Promise<{ message: string }> => {
  const response = await api.post('/auth/change-password', dto)
  return response.data
}
