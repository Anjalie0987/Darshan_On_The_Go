import { Module } from '@nestjs/common';
import { LiveStreamSchedulerService } from './live-stream.scheduler';
import { YoutubeModule } from '../youtube/youtube.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [YoutubeModule, DatabaseModule],
  providers: [LiveStreamSchedulerService],
})
export class SchedulerModule {}
