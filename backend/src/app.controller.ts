
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from './common/decorators';

@Controller()
export class AppController {
  @Public()
  @Get('health')
  @HttpCode(HttpStatus.OK)
  checkHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
