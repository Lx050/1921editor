import api from '../utils/api'

// ==================== 类型定义 ====================

export interface LoginDto {
  email: string
  password: string
}

export interface TenantInfo {
  id: string
  name: string
  slug: string
  isDefault?: boolean
}

export interface RegisterDto {
  email: string
  password: string
  name: string
  inviteCode: string
  createTenant?: boolean
  tenantName?: string
  tenantSlug?: string
  wechatAppId?: string
  wechatAppSecret?: string
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
    displayName?: string
    role: string
    tenantId: string
    emailVerified: boolean
  }
  tenant: TenantInfo
  tenants: TenantInfo[]
}

export interface RegisterResponse {
  message: string
  userId?: string
}

export interface SwitchTenantDto {
  tenantId: string
}

export interface JoinTenantDto {
  inviteCode: string
  displayName: string
}

export interface LeaveTenantDto {
  tenantId: string
}

// ==================== 认证 API ====================

/**
 * 用户注册
 */
export const register = async (dto: RegisterDto): Promise<RegisterResponse> => {
  const response = await api.post('/auth/register', dto)
  return response.data
}

/**
 * 验证邮箱
 */
export const verifyEmail = async (dto: VerifyEmailDto): Promise<AuthResponse> => {
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

export const listTenants = async (): Promise<{ tenants: TenantInfo[] }> => {
  const response = await api.get('/auth/tenants')
  return response.data
}

export const switchTenant = async (
  dto: SwitchTenantDto
): Promise<AuthResponse> => {
  const response = await api.post('/auth/switch-tenant', dto)
  return response.data
}

export const joinTenant = async (
  dto: JoinTenantDto
): Promise<AuthResponse> => {
  const response = await api.post('/auth/join-tenant', dto)
  return response.data
}

export const leaveTenant = async (
  dto: LeaveTenantDto
): Promise<AuthResponse> => {
  const response = await api.post('/auth/leave-tenant', dto)
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
