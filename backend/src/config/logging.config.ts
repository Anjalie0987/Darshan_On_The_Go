import { IsBoolean, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export enum LogLevel {
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
}

export class LoggingEnvironmentVariables {
  @IsEnum(LogLevel)
  @IsOptional()
  LOG_LEVEL: LogLevel = LogLevel.Info;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  LOG_PRETTY: boolean = false;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  LOG_SLOW_QUERY_THRESHOLD: number = 1000;

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  LOG_SLOW_REQUEST_THRESHOLD: number = 2000;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  ENABLE_REQUEST_LOGGING: boolean = true;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  ENABLE_DB_LOGGING: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  ENABLE_PERFORMANCE_LOGGING: boolean = true;
}
