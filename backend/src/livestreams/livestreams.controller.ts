import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { LiveStreamsRepository } from '../database/repositories/live-streams.repository';
import { Public } from '../common/decorators/public.decorator';

@Controller('live')
export class LivestreamsController {
  constructor(private readonly liveStreamsRepository: LiveStreamsRepository) {}

  @Public()
  @Get()
  async getActiveStreams() {
    try {
      const streams = await this.liveStreamsRepository.findActiveStreamsWithDetails();
      
      // Map database result to frontend format
      return streams.map(stream => ({
        id: stream.stream_id,
        title: stream.stream_title,
        templeName: stream.temple_name,
        thumbnail: stream.thumbnail_url,
        isLive: true,
        viewers: stream.viewer_count || 0,
        slug: stream.temple_slug,
        location: `${stream.temple_city}, ${stream.temple_state}`,
        startedAt: stream.started_at,
        streamUrl: stream.stream_url,
        embedUrl: stream.embed_url
      }));
    } catch (error) {
      throw new HttpException('Failed to fetch live streams', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
