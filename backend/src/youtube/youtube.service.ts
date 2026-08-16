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
  uploadsPlaylistId: string | null;
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
        part: 'snippet,statistics,contentDetails',
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
        uploadsPlaylistId: channel.contentDetails?.relatedPlaylists?.uploads || null,
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

  /**
   * Fetches the latest video IDs from a channel's uploads playlist.
   */
  async getRecentVideosFromPlaylist(playlistId: string, maxResults = 5): Promise<string[]> {
    try {
      const params = {
        part: 'contentDetails',
        playlistId: playlistId,
        maxResults: maxResults,
        key: this.apiKey,
      };

      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/playlistItems`, { params }),
      );

      const items = response.data.items;
      if (!items || items.length === 0) {
        return [];
      }

      return items.map((item: any) => item.contentDetails?.videoId).filter(Boolean);
    } catch (error) {
      const axiosError = error as any;
      const status = axiosError.response?.status;
      if (status === 403) {
        throw new HttpException('YouTube API quota exceeded or forbidden', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Failed to fetch recent videos from playlist', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Fetches live streaming details for a batch of video IDs.
   * Returns a map of videoId -> live data.
   */
  async getVideoLiveDetails(videoIds: string[]): Promise<any[]> {
    if (!videoIds || videoIds.length === 0) return [];

    try {
      // API allows max 50 ids per request.
      const batchIds = videoIds.slice(0, 50).join(',');
      
      const params = {
        part: 'snippet,liveStreamingDetails',
        id: batchIds,
        key: this.apiKey,
      };

      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/videos`, { params }),
      );

      const items = response.data.items;
      if (!items) {
        return [];
      }

      return items.map((item: any) => {
        const snippet = item.snippet;
        const liveStreamingDetails = item.liveStreamingDetails;
        
        return {
          videoId: item.id,
          title: snippet.title,
          thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url || '',
          liveUrl: `https://www.youtube.com/watch?v=${item.id}`,
          embedUrl: `https://www.youtube.com/embed/${item.id}`,
          publishedAt: snippet.publishedAt,
          channelId: snippet.channelId,
          channelName: snippet.channelTitle,
          liveBroadcastContent: snippet.liveBroadcastContent, // 'none', 'upcoming', 'live'
          actualStartTime: liveStreamingDetails?.actualStartTime || null,
          actualEndTime: liveStreamingDetails?.actualEndTime || null,
          scheduledStartTime: liveStreamingDetails?.scheduledStartTime || null,
        };
      });
    } catch (error) {
      const axiosError = error as any;
      const status = axiosError.response?.status;
      if (status === 403) {
        throw new HttpException('YouTube API quota exceeded or forbidden', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Failed to fetch video live details', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
