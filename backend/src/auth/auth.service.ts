import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UAParser } from 'ua-parser-js';
import { UsersRepository } from '../database/repositories/users.repository';
import { UserSessionsRepository, UserSession } from '../database/repositories/user-sessions.repository';
import { RegisterDto, LoginDto, AuthResponseDto, CurrentUserDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private userSessionsRepository: UserSessionsRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const saltRounds = this.configService.get<number>('BCRYPT_SALT_ROUNDS') || 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const newUser = await this.usersRepository.create({
      email: registerDto.email,
      password_hash: hashedPassword,
      first_name: registerDto.firstName || null,
      last_name: registerDto.lastName || null,
      is_active: true,
    });

    return this.generateAuthResponse(newUser, ipAddress, userAgent);
  }

  async login(loginDto: LoginDto, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findByEmail(loginDto.email);
    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('User account is disabled');
    }

    return this.generateAuthResponse(user, ipAddress, userAgent);
  }

  async refreshToken(refreshToken: string, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersRepository.findById(payload.sub);
      if (!user || !user.is_active) {
        throw new UnauthorizedException('Invalid user');
      }

      const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      const session = await this.userSessionsRepository.findSessionByTokenHash(refreshTokenHash);

      if (!session) {
        throw new UnauthorizedException('Session revoked or invalid');
      }

      if (new Date() > session.expires_at) {
        throw new UnauthorizedException('Session expired');
      }

      // Rotate token: Revoke old session and generate a new one
      await this.userSessionsRepository.revokeSession(user.id, session.id);

      return this.generateAuthResponse(user, ipAddress, userAgent);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) return;
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const session = await this.userSessionsRepository.findSessionByTokenHash(refreshTokenHash);
    if (session) {
      await this.userSessionsRepository.revokeSession(session.user_id, session.id);
    }
  }

  async getSessions(userId: string): Promise<UserSession[]> {
    return this.userSessionsRepository.getUserSessions(userId);
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    await this.userSessionsRepository.revokeSession(userId, sessionId);
  }

  async revokeAllSessions(userId: string, excludeRefreshToken?: string): Promise<void> {
    let excludeSessionId: string | undefined;
    if (excludeRefreshToken) {
      const hash = crypto.createHash('sha256').update(excludeRefreshToken).digest('hex');
      const session = await this.userSessionsRepository.findSessionByTokenHash(hash);
      if (session) {
        excludeSessionId = session.id;
      }
    }
    await this.userSessionsRepository.revokeAllSessions(userId, excludeSessionId);
  }

  private async generateAuthResponse(user: any, ipAddress: string, userAgent: string): Promise<AuthResponseDto> {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRY') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRY') as any,
    });

    // Parse User Agent
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

    // Save session in database
    await this.userSessionsRepository.createSession({
      user_id: user.id,
      refresh_token_hash: refreshTokenHash,
      device_info: deviceInfo,
      ip_address: ipAddress || 'unknown',
      expires_at: expiresAt,
    });

    const currentUser: CurrentUserDto = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isActive: user.is_active,
      roles: [],
    };

    return {
      accessToken,
      refreshToken,
      user: currentUser,
    };
  }
}
