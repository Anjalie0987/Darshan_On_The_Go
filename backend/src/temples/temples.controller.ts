import { Controller, Get, Param, Query, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { TemplesRepository } from '../database/repositories/temples.repository';
import { Public } from '../common/decorators/public.decorator';

@Controller('temples')
export class TemplesController {
  constructor(private readonly templesRepository: TemplesRepository) {}

  @Public()
  @Get()
  async getTemples(
    @Query('search') search?: string,
    @Query('state') state?: string,
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('live') live?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '12',
  ) {
    try {
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      
      const result = await this.templesRepository.findAllWithFilters({
        search, state, city, category, live, page: pageNum, limit: limitNum
      });
      
      return result;
    } catch (error) {
      throw new HttpException('Failed to fetch temples', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Get(':slug')
  async getTempleBySlug(@Param('slug') slug: string) {
    try {
      const temple = await this.templesRepository.findBySlugWithLiveStream(slug);
      
      if (!temple) {
        throw new NotFoundException('Temple not found');
      }
      
      // Formatting the response
      return {
        id: temple.id,
        name: temple.name,
        slug: temple.slug,
        description: temple.description,
        location: `${temple.city}, ${temple.state}`,
        address: temple.address_line,
        pincode: temple.pincode,
        website: temple.official_website,
        email: temple.official_email,
        phone: temple.official_phone,
        googleMapsUrl: temple.google_maps_url,
        isLive: temple.is_live,
        youtubeChannelUrl: temple.youtube_channel_url,
        liveStream: temple.stream_id ? {
          id: temple.stream_id,
          title: temple.stream_title,
          thumbnailUrl: temple.stream_thumbnail_url,
          streamUrl: temple.stream_url,
          embedUrl: temple.embed_url,
          startedAt: temple.stream_started_at,
          viewers: temple.viewer_count
        } : null
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException('Failed to fetch temple details', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
