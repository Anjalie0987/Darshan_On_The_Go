import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LiveStreamSchedulerService } from './live-stream.scheduler';
import { UploadsPlaylistBackfillService } from './uploads-playlist-backfill.service';
import { YoutubeModule } from '../youtube/youtube.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [YoutubeModule, DatabaseModule, HttpModule],
  providers: [LiveStreamSchedulerService, UploadsPlaylistBackfillService],
})
export class SchedulerModule {}
