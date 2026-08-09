import { Controller, Get, Post, Delete, Param, UseGuards, HttpException, HttpStatus, Req } from '@nestjs/common';
import { FavoritesRepository } from '../database/repositories/favorites.repository';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

// Extend Express Request to include user payload from JwtAuthGuard
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesRepository: FavoritesRepository) {}

  @Get()
  async getFavorites(@Req() req: AuthenticatedRequest) {
    try {
      const favorites = await this.favoritesRepository.getUserFavorites(req.user.userId);
      return favorites;
    } catch (error) {
      throw new HttpException('Failed to fetch favorites', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':templeId')
  async getFavoriteStatus(@Req() req: AuthenticatedRequest, @Param('templeId') templeId: string) {
    try {
      const isFavorited = await this.favoritesRepository.hasFavorite(req.user.userId, templeId);
      return { isFavorited };
    } catch (error) {
      throw new HttpException('Failed to check favorite status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':templeId')
  async addFavorite(@Req() req: AuthenticatedRequest, @Param('templeId') templeId: string) {
    try {
      await this.favoritesRepository.addFavorite(req.user.userId, templeId);
      return { success: true };
    } catch (error) {
      throw new HttpException('Failed to add favorite', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':templeId')
  async removeFavorite(@Req() req: AuthenticatedRequest, @Param('templeId') templeId: string) {
    try {
      await this.favoritesRepository.removeFavorite(req.user.userId, templeId);
      return { success: true };
    } catch (error) {
      throw new HttpException('Failed to remove favorite', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
