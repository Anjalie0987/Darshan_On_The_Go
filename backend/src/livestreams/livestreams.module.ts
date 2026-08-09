import { Module } from '@nestjs/common';
import { LivestreamsController } from './livestreams.controller';

@Module({
  controllers: [LivestreamsController],
})
export class LivestreamsModule {}
