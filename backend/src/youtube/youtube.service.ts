import { Injectable, BadRequestException, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

export interface VerifiedChannelData {
  channelId: string;
  channelName: string;
  channelHandle: string;
  subscriberCount: string;
  description: string;
  publishedAt: string;
  customUrl: string | null;
}

@Injectable()
export class YoutubeService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://youtube.googleapis.com/youtube/v3';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('YOUTUBE_API_KEY') || '';
  }

  async verifyChannel(url: string): Promise<VerifiedChannelData> {
    if (!this.apiKey) {
      throw new HttpException('YouTube API Key is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let channelId = '';
    let handle = '';

    // Extract handle or channel ID from URL
    const handleMatch = url.match(/@([\w.-]+)$/);
    const idMatch = url.match(/\/channel\/(UC[\w-]+)$/);

    if (handleMatch) {
      handle = handleMatch[1];
    } else if (idMatch) {
      channelId = idMatch[1];
    } else {
      throw new BadRequestException('Invalid YouTube channel URL format');
    }

    try {
      const params: Record<string, string> = {
        part: 'snippet,statistics',
        key: this.apiKey,
      };

      if (handle) {
        params.forHandle = `@${handle}`;
      } else {
        params.id = channelId;
      }

      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/channels`, { params }),
      );

      const items = response.data.items;

      if (!items || items.length === 0) {
        throw new NotFoundException('YouTube channel not found');
      }

      const channel = items[0];
      const snippet = channel.snippet;
      const statistics = channel.statistics;

      return {
        channelId: channel.id,
        channelName: snippet.title,
        channelHandle: snippet.customUrl || '',
        subscriberCount: statistics?.subscriberCount || '0',
        description: snippet.description || '',
        publishedAt: snippet.publishedAt || '',
        customUrl: snippet.customUrl || null,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof HttpException) {
        throw error;
      }
      
      const axiosError = error as any;
      if (axiosError.response?.status === 403) {
        throw new HttpException('YouTube API quota exceeded or forbidden', HttpStatus.FORBIDDEN);
      }
      
      throw new HttpException(
        'Failed to verify YouTube channel',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkActiveLiveStream(channelId: string) {
    if (!this.apiKey) {
      throw new HttpException('YouTube API Key is not configured', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      const params: Record<string, string> = {
        part: 'snippet',
        channelId,
        eventType: 'live',
        type: 'video',
        key: this.apiKey,
      };

      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/search`, { params }),
      );

      const items = response.data.items;

      if (!items || items.length === 0) {
        return null; // No active live stream found
      }

      const stream = items[0];
      const snippet = stream.snippet;
      const videoId = stream.id.videoId;

      return {
        videoId,
        title: snippet.title,
        thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
        liveUrl: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        startedAt: snippet.publishedAt,
        channelId: snippet.channelId,
        channelName: snippet.channelTitle,
      };
    } catch (error) {
      const axiosError = error as any;
      if (axiosError.response?.status === 403) {
        throw new HttpException('YouTube API quota exceeded or forbidden', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Failed to check active live stream', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
