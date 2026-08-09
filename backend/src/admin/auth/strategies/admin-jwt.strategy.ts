import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') || 'defaultSecret',
    });
  }

  async validate(payload: any) {
    console.log('AdminJwtStrategy validate payload:', payload);
    if (!payload || !payload.sub || payload.userType !== 'ADMIN') {
      throw new UnauthorizedException('Invalid admin token');
    }
    
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      userType: payload.userType,
    };
  }
}
