import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WechatService } from './wechat.service';
import { WechatController } from './wechat.controller';
import { Tenant } from '../entities/tenant.entity';
import { WechatAuthorizer } from '../entities/wechat-authorizer.entity';
import { WechatPlatformConfig } from '../entities/wechat-platform-config.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Tenant, WechatAuthorizer, WechatPlatformConfig]),
  ],
  controllers: [WechatController],
  providers: [WechatService],
  exports: [WechatService],
})
export class WechatModule {}
