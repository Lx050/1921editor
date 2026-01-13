import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Request,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StyleTemplateService } from './style-template.service';
import {
  CreateStyleTemplateDto,
  UpdateStyleTemplateDto,
} from './style-template.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@ApiTags('style-templates')
@Controller('style-templates')
export class StyleTemplateController {
  constructor(
    private readonly styleService: StyleTemplateService,
    private readonly configService: ConfigService,
  ) {}

  private getDefaultTenantId(): string {
    return (
      this.configService.get<string>('DEFAULT_TENANT_ID') ||
      '00000000-0000-0000-0000-000000000001'
    );
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '获取所有可用样式' })
  findAll(@Request() req: any) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();
    return this.styleService.findAll(tenantId);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: '获取单个样式详情' })
  findOne(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || this.getDefaultTenantId();
    return this.styleService.findOne(id, tenantId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: '创建自定义样式' })
  create(@Body() dto: CreateStyleTemplateDto, @Request() req: any) {
    return this.styleService.create(dto, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: '更新自定义样式' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateStyleTemplateDto,
    @Request() req: any,
  ) {
    return this.styleService.update(id, dto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除自定义样式' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.styleService.delete(id, req.user);
  }
}
