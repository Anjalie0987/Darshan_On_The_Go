import { Controller, Get, Query, UseGuards, HttpException, HttpStatus, Post, Put, Param, Body, NotFoundException, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminJwtAuthGuard } from '../auth/guards/admin-jwt-auth.guard';
import { TemplesRepository } from '../../database/repositories/temples.repository';
import { YoutubeService } from '../../youtube/youtube.service';
import { ApiUnauthorized } from '../../swagger/swagger.decorators';
import { Public } from '../../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const multerOptions = {
  storage: diskStorage({
    destination: './uploads/temples',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
};

@ApiTags('Admin Temples')
@Controller('admin/temples')
@Public()
@UseGuards(AdminJwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class AdminTemplesController {
  constructor(
    private readonly templesRepository: TemplesRepository,
    private readonly youtubeService: YoutubeService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all temples for admin with filters' })
  @ApiUnauthorized()
  async getTemples(
    @Query('search') search?: string,
    @Query('state') state?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('liveStatus') liveStatus?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '12',
  ) {
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      
      const result = await this.templesRepository.findAdminAllWithFilters({
        search, state, category, status, liveStatus, page: pageNum, limit: limitNum
      });
      
      return result;
    } catch (error) {
      throw new HttpException('Failed to fetch admin temples', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get temple by id' })
  @ApiUnauthorized()
  async getTempleById(@Param('id') id: string) {
    try {
      const temple = await this.templesRepository.getAdminTempleById(id);
      if (!temple) {
        throw new NotFoundException('Temple not found');
      }
      return temple;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to fetch temple', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create new temple' })
  @ApiUnauthorized()
  @UseInterceptors(FileInterceptor('coverImage', multerOptions))
  async createTemple(@Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    try {
      if (file) {
        body.imageUrl = `/uploads/temples/${file.filename}`;
      }
      
      if (body.youtubeChannelUrl) {
        const verifiedData = await this.youtubeService.verifyChannel(body.youtubeChannelUrl);
        body.youtubeChannelId = verifiedData.channelId;
        body.youtubeChannelName = verifiedData.channelName;
        body.youtubeChannelHandle = verifiedData.channelHandle;
        body.youtubeVerificationStatus = 'VERIFIED';
      }
      
      return await this.templesRepository.createAdminTemple(body);
    } catch (error: any) {
      console.error('Error creating temple:', error);
      if (error.code === '23505') {
        throw new HttpException('A temple with this slug already exists.', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message || 'Failed to create temple', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update temple' })
  @ApiUnauthorized()
  @UseInterceptors(FileInterceptor('coverImage', multerOptions))
  async updateTemple(@Param('id') id: string, @Body() body: any, @UploadedFile() file?: Express.Multer.File) {
    try {
      if (file) {
        body.imageUrl = `/uploads/temples/${file.filename}`;
      }
      
      if (body.youtubeChannelUrl) {
        const verifiedData = await this.youtubeService.verifyChannel(body.youtubeChannelUrl);
        body.youtubeChannelId = verifiedData.channelId;
        body.youtubeChannelName = verifiedData.channelName;
        body.youtubeChannelHandle = verifiedData.channelHandle;
        body.youtubeVerificationStatus = 'VERIFIED';
      }
      
      return await this.templesRepository.updateAdminTemple(id, body);
    } catch (error: any) {
      console.error('Error updating temple:', error);
      if (error.message && error.message.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      if (error.code === '23505') {
        throw new HttpException('A temple with this slug already exists.', HttpStatus.CONFLICT);
      }
      throw new HttpException(error.message || 'Failed to update temple', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete temple' })
  @ApiUnauthorized()
  async deleteTemple(@Param('id') id: string) {
    try {
      const deleted = await this.templesRepository.deleteAdminTemple(id);
      if (!deleted) {
        throw new NotFoundException('Temple not found or already deleted');
      }
      return { success: true, message: 'Temple deleted successfully' };
    } catch (error) {
      console.error('Error deleting temple:', error);
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to delete temple', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
