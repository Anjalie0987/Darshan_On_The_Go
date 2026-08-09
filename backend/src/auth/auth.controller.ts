import { Controller, Post, Body, Get, Delete, Param, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, AuthResponseDto, CurrentUserDto } from './dto';
import { Public, CurrentUser } from '../common/decorators';
import { ApiValidation, ApiUnauthorized, ApiConflict, ApiGlobalResponse } from '../swagger/swagger.decorators';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiGlobalResponse(AuthResponseDto)
  @ApiValidation()
  @ApiConflict()
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    const ip = req.ip || req.connection?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const data = await this.authService.register(registerDto, ip, userAgent);
    return { data };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiGlobalResponse(AuthResponseDto)
  @ApiValidation()
  @ApiUnauthorized()
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    const ip = req.ip || req.connection?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const data = await this.authService.login(loginDto, ip, userAgent);
    return { data };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using a refresh token' })
  @ApiGlobalResponse(AuthResponseDto)
  @ApiValidation()
  @ApiUnauthorized()
  async refresh(@Body() refreshTokenDto: RefreshTokenDto, @Req() req: Request) {
    const ip = req.ip || req.connection?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const data = await this.authService.refreshToken(refreshTokenDto.refreshToken, ip, userAgent);
    return { data };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout a user (revoke current session)' })
  @ApiUnauthorized()
  async logout(@Body() body: RefreshTokenDto) {
    await this.authService.logout(body.refreshToken);
    return { data: { success: true } };
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @ApiGlobalResponse(CurrentUserDto)
  @ApiUnauthorized()
  async getProfile(@CurrentUser() user: any) {
    return { data: user };
  }

  @Get('sessions')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all active sessions for the current user' })
  @ApiUnauthorized()
  async getSessions(@CurrentUser() user: any) {
    const sessions = await this.authService.getSessions(user.id);
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
  @ApiOperation({ summary: 'Revoke a specific session' })
  @ApiParam({ name: 'sessionId', description: 'ID of the session to revoke' })
  @ApiUnauthorized()
  async revokeSession(@CurrentUser() user: any, @Param('sessionId') sessionId: string) {
    await this.authService.revokeSession(user.id, sessionId);
    return { data: { success: true } };
  }

  @Delete('sessions')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Revoke all sessions (except current, if refresh token is provided in body)' })
  @ApiUnauthorized()
  async revokeAllSessions(@CurrentUser() user: any, @Body() body?: { refreshToken?: string }) {
    await this.authService.revokeAllSessions(user.id, body?.refreshToken);
    return { data: { success: true } };
  }
}
