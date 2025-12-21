import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { FeishuModule } from '../feishu/feishu.module';
import { ConfigModule } from '@nestjs/config';
import { SyncController } from './sync.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FeishuModule, ConfigModule],
  providers: [SyncService],
  exports: [SyncService],
  controllers: [SyncController],
})
export class SyncModule {}
