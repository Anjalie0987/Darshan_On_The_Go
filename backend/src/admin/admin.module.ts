import { Module } from '@nestjs/common';
import { AdminAuthModule } from './auth/admin-auth.module';
import { AdminDashboardController } from './dashboard/dashboard.controller';
import { AdminTemplesController } from './temples/temples.controller';

@Module({
  imports: [AdminAuthModule],
  controllers: [AdminDashboardController, AdminTemplesController],
})
export class AdminModule {}
