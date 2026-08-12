import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { YoutubeService } from '../youtube/youtube.service';
import { TemplesRepository } from '../database/repositories/temples.repository';
import { LiveStreamsRepository } from '../database/repositories/live-streams.repository';

@Injectable()
export class LiveStreamSchedulerService {
  private readonly logger = new Logger(LiveStreamSchedulerService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly youtubeService: YoutubeService,
    private readonly templesRepository: TemplesRepository,
    private readonly liveStreamsRepository: LiveStreamsRepository,
  ) {}

  // Run every 15 minutes by default, but we control the exact execution inside the handler
  // based on the time windows so the Cron string itself can just run frequently.
  @Cron('*/15 * * * *')
  async handleLiveStreamMonitoring() {
    this.logger.log('Starting Live Stream Monitoring Scheduler');
    
    // if (!this.isWithinMonitoringWindow()) {
    //   this.logger.log('Current time is outside of monitoring windows. Skipping check.');
    //   return;
    // }

    const batchSize = this.configService.get<number>('LIVE_CHECK_BATCH_SIZE') || 5;
    
    try {
      const startTime = Date.now();
      const eligibleTemples = await this.templesRepository.findEligibleForLiveMonitoring(batchSize);
      
      this.logger.log(`Found ${eligibleTemples.length} eligible temples in this batch.`);
      
      let streamsFound = 0;
      let offlineChannels = 0;
      let apiErrors = 0;

      for (const temple of eligibleTemples) {
        if (!temple.youtube_channel_id) continue;
        
        try {
          const liveData = await this.youtubeService.checkActiveLiveStream(temple.youtube_channel_id);
          
          if (liveData) {
            // Upsert live stream
            await this.liveStreamsRepository.upsertStream(temple.id, {
              stream_reference: liveData.videoId,
              stream_url: liveData.liveUrl,
              embed_url: liveData.embedUrl,
              title: liveData.title,
              thumbnail_url: liveData.thumbnailUrl,
            });
            
            // Mark temple as live
            await this.templesRepository.updateLastLiveCheckAt(temple.id, true);
            streamsFound++;
          } else {
            // No active stream found. Check if we need to end a currently active one in DB.
            const activeStream = await this.liveStreamsRepository.findActiveStreamByTemple(temple.id);
            if (activeStream) {
              await this.liveStreamsRepository.markStreamEnded(activeStream.id);
            }
            
            // Mark temple as not live
            await this.templesRepository.updateLastLiveCheckAt(temple.id, false);
            offlineChannels++;
          }
        } catch (error: any) {
          apiErrors++;
          this.logger.error(`Error checking channel ${temple.youtube_channel_id} for temple ${temple.id}: ${error.message}`);
          
          // Still update the timestamp so we don't get stuck on a failing temple
          await this.templesRepository.updateLastLiveCheckAt(temple.id, temple.is_live);
        }
      }

      const duration = Date.now() - startTime;
      this.logger.log(`Scheduler completed in ${duration}ms. Checked: ${eligibleTemples.length}, Found: ${streamsFound}, Offline: ${offlineChannels}, Errors: ${apiErrors}`);
    } catch (error: any) {
      this.logger.error(`Critical error during live stream monitoring: ${error.message}`);
    }
  }

  /**
   * Evaluates if the current time (converted to IST) falls within the configured windows.
   */
  private isWithinMonitoringWindow(): boolean {
    const morningStart = this.configService.get<string>('MORNING_START') || '04:00';
    const morningEnd = this.configService.get<string>('MORNING_END') || '10:00';
    const eveningStart = this.configService.get<string>('EVENING_START') || '16:00';
    const eveningEnd = this.configService.get<string>('EVENING_END') || '22:00';

    // Get current time in IST
    const now = new Date();
    // Convert current UTC time to IST (UTC + 5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; 
    const istTime = new Date(now.getTime() + istOffset);
    
    const currentHour = istTime.getUTCHours();
    const currentMinute = istTime.getUTCMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;

    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return (hours * 60) + minutes;
    };

    const isMorning = currentTimeMinutes >= parseTime(morningStart) && currentTimeMinutes <= parseTime(morningEnd);
    const isEvening = currentTimeMinutes >= parseTime(eveningStart) && currentTimeMinutes <= parseTime(eveningEnd);

    return isMorning || isEvening;
  }
}
