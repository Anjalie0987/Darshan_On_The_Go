import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [], // Utilities, filters, interceptors could go here if they weren't in AppModule
  exports: [],
})
export class CommonModule {}
