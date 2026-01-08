import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NanoBananaService } from './nano-banana.service';
import { GenerateImageDto } from './dto/generate-image.dto';

@Controller('nano-banana')
export class NanoBananaController {
  constructor(private readonly nanoBananaService: NanoBananaService) {}

  @Post('generate')
  async generate(@Body() dto: GenerateImageDto) {
    return this.nanoBananaService.generateImage(dto);
  }
}
