import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  RegisterDto,
  LoginDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  SwitchTenantDto,
  JoinTenantDto,
  LeaveTenantDto,
} from './dto';

/**
 * 认证控制器
 * 提供用户注册、登录、邮箱验证、密码重置等接口
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户注册
   */
  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 409, description: '邮箱已被注册' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  /**
   * 验证邮箱
   */
  @Post('verify-email')
  @ApiOperation({ summary: '验证邮箱' })
  @ApiResponse({ status: 200, description: '验证成功，返回登录凭证' })
  @ApiResponse({ status: 400, description: '令牌无效或已过期' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  /**
   * 用户登录
   */
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '邮箱或密码错误' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.loginWithEmail(loginDto);
  }

  /**
   * 请求密码重置
   */
  @Post('forgot-password')
  @ApiOperation({ summary: '请求密码重置' })
  @ApiResponse({ status: 200, description: '如果邮箱存在，重置邮件已发送' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  /**
   * 重置密码
   */
  @Post('reset-password')
  @ApiOperation({ summary: '重置密码' })
  @ApiResponse({ status: 200, description: '密码重置成功' })
  @ApiResponse({ status: 400, description: '令牌无效或已过期' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  /**
   * 修改密码（需要登录）
   */
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '修改密码' })
  @ApiResponse({ status: 200, description: '密码修改成功' })
  @ApiResponse({ status: 401, description: '未授权' })
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(req.user.sub, changePasswordDto);
  }

  /**
   * 获取当前用户信息（需要登录）
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: 200, description: '成功返回用户信息' })
  @ApiResponse({ status: 401, description: '未授权' })
  async getCurrentUser(@Request() req) {
    return {
      user: {
        id: req.user.sub,
        email: req.user.email,
        tenantId: req.user.tenantId,
        role: req.user.role,
      },
    };
  }

  /**
   * 获取当前用户可访问的组织列表
   */
  @Get('tenants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户的组织列表' })
  @ApiResponse({ status: 200, description: '成功返回组织列表' })
  async listTenants(@Request() req) {
    return this.authService.listTenants(req.user.sub);
  }

  /**
   * 切换当前租户
   */
  @Post('switch-tenant')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '切换当前组织' })
  @ApiResponse({ status: 200, description: '切换成功，返回新 token' })
  async switchTenant(
    @Request() req,
    @Body() switchTenantDto: SwitchTenantDto,
  ) {
    return this.authService.switchTenant(req.user.sub, switchTenantDto.tenantId);
  }

  /**
   * 加入组织（通过邀请码）
   */
  @Post('join-tenant')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '加入组织（邀请码）' })
  @ApiResponse({ status: 200, description: '加入成功' })
  async joinTenant(@Request() req, @Body() joinTenantDto: JoinTenantDto) {
    return this.authService.joinTenantByInviteCode(req.user.sub, joinTenantDto);
  }

  /**
   * 退出组织
   */
  @Post('leave-tenant')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '退出组织' })
  @ApiResponse({ status: 200, description: '退出成功' })
  async leaveTenant(@Request() req, @Body() leaveTenantDto: LeaveTenantDto) {
    return this.authService.leaveTenant(req.user.sub, leaveTenantDto);
  }
}
