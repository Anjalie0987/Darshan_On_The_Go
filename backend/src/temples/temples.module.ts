import { Module } from '@nestjs/common';
import { TemplesController } from './temples.controller';
import { CategoriesController } from './categories.controller';
import { AartisController } from './aartis.controller';

@Module({
  controllers: [TemplesController, CategoriesController, AartisController],
})
export class TemplesModule {}
