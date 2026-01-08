import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NanoBananaController } from './nano-banana.controller';
import { NanoBananaService } from './nano-banana.service';

@Module({
  imports: [ConfigModule],
  controllers: [NanoBananaController],
  providers: [NanoBananaService],
  exports: [NanoBananaService],
})
export class NanoBananaModule {}
