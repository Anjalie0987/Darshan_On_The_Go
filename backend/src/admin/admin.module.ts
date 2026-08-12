import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/admin-auth.module';
import { AdminDashboardController } from './dashboard/dashboard.controller';
import { AdminTemplesController } from './temples/temples.controller';
import { YoutubeModule } from '../youtube/youtube.module';

@Module({
  imports: [AdminAuthModule, YoutubeModule],
  controllers: [AdminDashboardController, AdminTemplesController],
})
export class AdminModule {}
