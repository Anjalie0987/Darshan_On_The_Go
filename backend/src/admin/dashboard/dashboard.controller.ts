import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth.guard';
import { TemplesRepository } from '../../database/repositories/temples.repository';
import { ApiUnauthorized } from '../../swagger/swagger.decorators';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Admin Dashboard')
@Controller('admin/dashboard')
@UseGuards(AdminJwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AdminDashboardController {
  constructor(private readonly templesRepository: TemplesRepository) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @Public()
  async getStats() {
    return await this.templesRepository.getDashboardStats();
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get recent activity for dashboard' })
  @ApiUnauthorized()
  async getRecentActivity() {
    return await this.templesRepository.getRecentActivity();
  }
}
