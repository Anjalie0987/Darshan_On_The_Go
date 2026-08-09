import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class AppEnvironmentVariables {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number = 3001;

  @IsString()
  @IsOptional()
  API_PREFIX: string = 'api';

  @IsInt()
  @IsOptional()
  LIVE_CHECK_INTERVAL: number = 15;

  @IsString()
  @IsOptional()
  MORNING_START: string = '04:00';

  @IsString()
  @IsOptional()
  MORNING_END: string = '10:00';

  @IsString()
  @IsOptional()
  EVENING_START: string = '16:00';

  @IsString()
  @IsOptional()
  EVENING_END: string = '22:00';

  @IsInt()
  @IsOptional()
  LIVE_CHECK_BATCH_SIZE: number = 5;
}
