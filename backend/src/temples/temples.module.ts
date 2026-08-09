import { Module } from '@nestjs/common';
import { TemplesController } from './temples.controller';

@Module({
  controllers: [TemplesController],
})
export class TemplesModule {}
