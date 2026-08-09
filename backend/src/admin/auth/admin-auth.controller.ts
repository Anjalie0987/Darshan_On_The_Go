import { Controller, Post, Body, Get, HttpCode, HttpStatus, Req, UseGuards, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { AdminAuthService } from './admin-auth.service';
import { LoginDto, RefreshTokenDto, AuthResponseDto, CurrentAdminDto } from './dto';
import { AdminJwtAuthGuard } from './guards/admin-jwt-auth.guard';
import { CurrentAdmin } from '../../common/decorators/admin.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { ApiValidation, ApiUnauthorized, ApiGlobalResponse } from '../../swagger/swagger.decorators';

@ApiTags('Admin Authentication')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login admin with email and password' })
  @ApiGlobalResponse(AuthResponseDto)
  @ApiValidation()
  @ApiUnauthorized()
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const ip = req.ip || req.connection?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const data = await this.adminAuthService.login(loginDto, ip, userAgent);
    return data;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using an admin refresh token' })
  @ApiGlobalResponse(AuthResponseDto)
  @ApiValidation()
  @ApiUnauthorized()
  async refresh(@Body() refreshTokenDto: RefreshTokenDto, @Req() req: Request) {
    const ip = req.ip || req.connection?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const data = await this.adminAuthService.refreshToken(refreshTokenDto.refreshToken, ip, userAgent);
    return data;
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Logout admin (revoke current session)' })
  @ApiUnauthorized()
  async logout(@Body() body: RefreshTokenDto) {
    await this.adminAuthService.logout(body.refreshToken);
    return { success: true };
  }

  @Public()
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated admin profile' })
  @ApiGlobalResponse(CurrentAdminDto)
  @ApiUnauthorized()
  async getProfile(@CurrentAdmin() admin: any) {
    const profile = await this.adminAuthService.getProfile(admin.id || admin.sub);
    return profile;
  }

  @Get('sessions')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Get all active sessions for the current admin' })
  @ApiUnauthorized()
  async getSessions(@CurrentAdmin() admin: any) {
    const sessions = await this.adminAuthService.getSessions(admin.id || admin.sub);
    const safeSessions = sessions.map(s => {
      const { refresh_token_hash, ...safeSession } = s;
      return {
        ...safeSession,
        device_info: s.device_info ? JSON.parse(s.device_info) : null,
      };
    });
    return { data: safeSessions };
  }

  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Revoke a specific admin session' })
  @ApiUnauthorized()
  async revokeSession(@CurrentAdmin() admin: any, @Param('sessionId') sessionId: string) {
    await this.adminAuthService.revokeSession(admin.id || admin.sub, sessionId);
    return { success: true };
  }
}
