import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { YoutubeService } from './youtube.service';
import { AdminJwtAuthGuard } from '../admin/auth/guards/admin-jwt-auth.guard';

@Controller('youtube')
@UseGuards(AdminJwtAuthGuard)
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Post('verify-channel')
  async verifyChannel(@Body('url') url: string) {
    return this.youtubeService.verifyChannel(url);
  }
}
