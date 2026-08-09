import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UAParser } from 'ua-parser-js';
import { AdminsRepository } from '../../database/repositories/admins.repository';
import { AdminSessionsRepository, AdminSession } from '../../database/repositories/admin-sessions.repository';
import { LoginDto, AuthResponseDto, CurrentAdminDto } from './dto';

@Injectable()
export class AdminAuthService {
  constructor(
    private adminsRepository: AdminsRepository,
    private adminSessionsRepository: AdminSessionsRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
    const admin = await this.adminsRepository.findByEmail(loginDto.email);
    if (!admin || !admin.password_hash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, admin.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!admin.is_active) {
      throw new UnauthorizedException('Admin account is disabled');
    }

    return this.generateAuthResponse(admin, ipAddress, userAgent);
  }

  async refreshToken(refreshToken: string, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      if (payload.userType !== 'ADMIN') {
        throw new UnauthorizedException('Invalid admin token');
      }

      const admin = await this.adminsRepository.findById(payload.sub);
      if (!admin || !admin.is_active) {
        throw new UnauthorizedException('Invalid admin');
      }

      const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      const session = await this.adminSessionsRepository.findSessionByTokenHash(refreshTokenHash);

      if (!session) {
        throw new UnauthorizedException('Session revoked or invalid');
      }

      if (new Date() > session.expires_at) {
        throw new UnauthorizedException('Session expired');
      }

      // Rotate token
      await this.adminSessionsRepository.revokeSession(admin.id, session.id);

      return this.generateAuthResponse(admin, ipAddress, userAgent);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const session = await this.adminSessionsRepository.findSessionByTokenHash(refreshTokenHash);
    if (session) {
      await this.adminSessionsRepository.revokeSession(session.admin_id, session.id);
    }
  }

  async getProfile(adminId: string) {
    const admin = await this.adminsRepository.findById(adminId);
    if (!admin) {
      throw new UnauthorizedException('Admin not found');
    }
    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isActive: admin.is_active,
      created_at: admin.created_at,
    };
  }

  async getSessions(adminId: string) {
    return this.adminSessionsRepository.getAdminSessions(adminId);
  }

  async revokeSession(adminId: string, sessionId: string): Promise<void> {
    await this.adminSessionsRepository.revokeSession(adminId, sessionId);
  }

  private async generateAuthResponse(admin: any, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
    const payload = { sub: admin.id, email: admin.email, role: admin.role, userType: 'ADMIN' };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRY') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRY') as any,
    });

    const parser = new UAParser(userAgent);
    const deviceInfo = JSON.stringify({
      deviceName: parser.getDevice().model || 'Unknown Device',
      browser: parser.getBrowser().name || 'Unknown Browser',
      os: parser.getOS().name || 'Unknown OS',
      userAgent,
      lastActiveTimestamp: new Date().toISOString(),
    });

    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const decodedRefresh = this.jwtService.decode(refreshToken) as any;
    const expiresAt = new Date(decodedRefresh.exp * 1000);

    await this.adminSessionsRepository.createSession({
      admin_id: admin.id,
      refresh_token_hash: refreshTokenHash,
      device_info: deviceInfo,
      ip_address: ipAddress || 'unknown',
      expires_at: expiresAt,
    });

    const currentAdmin: CurrentAdminDto = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      isActive: admin.is_active,
    };

    return {
      accessToken,
      refreshToken,
      admin: currentAdmin,
    };
  }
}
