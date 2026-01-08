import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../entities/tenant.entity';
import { User } from '../entities/user.entity';
import { SystemInitService } from './system-init.service';
import { SystemInitController } from './system-init.controller';
import { PasswordHashService } from '../services/password-hash.service';
import { InviteCodeService } from '../services/invite-code.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant, User]), ConfigModule],
  controllers: [SystemInitController],
  providers: [SystemInitService, PasswordHashService, InviteCodeService],
  exports: [SystemInitService],
})
export class SystemModule {}
