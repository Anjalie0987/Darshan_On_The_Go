import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET') || 'defaultSecret',
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException();
    }
    
    // Strict isolation: Prevent Admin JWTs from accessing User endpoints
    if (payload.userType === 'ADMIN') {
      throw new UnauthorizedException('Admin tokens cannot access user endpoints');
    }

    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
    };
  }
}
