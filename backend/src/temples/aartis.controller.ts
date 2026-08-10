import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AartiSchedulesRepository } from '../database/repositories/aarti-schedules.repository';
import { Public } from '../common/decorators/public.decorator';

@Controller('aartis')
export class AartisController {
  constructor(private readonly aartiSchedulesRepository: AartiSchedulesRepository) {}

  @Public()
  @Get('today')
  async getTodaysAartis() {
    try {
      const today = new Date().getDay(); // 0 is Sunday, 6 is Saturday
      const aartis = await this.aartiSchedulesRepository.findTodaysAartis(today);
      
      return aartis.map(aarti => ({
        id: aarti.id,
        name: aarti.name,
        timeStart: aarti.time_start,
        timeEnd: aarti.time_end,
        timeZone: aarti.time_zone,
        templeName: aarti.temple_name,
        templeSlug: aarti.temple_slug,
        location: aarti.temple_city && aarti.temple_state ? `${aarti.temple_city}, ${aarti.temple_state}` : aarti.temple_state || aarti.temple_city || '',
        templeImage: aarti.temple_image_url
      }));
    } catch (error) {
      throw new HttpException('Failed to fetch todays aartis', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
