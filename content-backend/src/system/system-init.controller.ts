import { Controller, Post, Get, Body, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeController,
} from '@nestjs/swagger';
import { SystemInitService } from './system-init.service';

/**
 * 系统初始化 DTO
 */
export class SystemInitDto {
  adminEmail: string;
  adminPassword: string;
  adminName: string;
  tenantName: string;
  tenantSlug: string;
}

/**
 * 系统初始化控制器
 * 仅在系统首次部署时使用
 */
@ApiTags('System')
@ApiExcludeController() // 默认从 Swagger 文档中排除
@Controller('system')
export class SystemInitController {
  private readonly logger = new Logger(SystemInitController.name);

  constructor(private readonly systemInitService: SystemInitService) {}

  /**
   * 检查系统是否已初始化
   */
  @Get('initialized')
  @ApiOperation({ summary: '检查系统是否已初始化' })
  @ApiResponse({ status: 200, description: '返回初始化状态' })
  async checkInitialized() {
    const initialized = await this.systemInitService.isInitialized();
    return { initialized };
  }

  /**
   * 初始化系统
   */
  @Post('initialize')
  @ApiOperation({ summary: '初始化系统（仅首次）' })
  @ApiResponse({ status: 201, description: '系统初始化成功' })
  @ApiResponse({ status: 400, description: '系统已经初始化' })
  async initialize(@Body() initDto: SystemInitDto) {
    this.logger.log('系统初始化请求');
    return this.systemInitService.initialize(initDto);
  }
}
