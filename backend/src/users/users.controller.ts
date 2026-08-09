import { Controller, Get, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersRepository } from '../database/repositories/users.repository';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Get('profile')
  async getProfile(@Req() req: AuthenticatedRequest) {
    try {
      const profile = await this.usersRepository.getProfile(req.user.id);
      if (!profile) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return profile;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Failed to fetch user profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
