import { IsString, IsInt, IsOptional, IsBoolean, Min, Max, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Validated database configuration loaded from environment variables.
 * The application will fail to start if these constraints are not met.
 */
export class DatabaseEnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_HOST!: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  @Transform(({ value }) => parseInt(value, 10))
  DATABASE_PORT!: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_USER!: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD!: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === '1')
  DATABASE_SSL?: boolean = false;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 0))
  DATABASE_POOL_MIN: number = 0;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  DATABASE_POOL_MAX: number = 10;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 30000))
  DATABASE_IDLE_TIMEOUT: number = 30000;

  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 2000))
  DATABASE_CONNECTION_TIMEOUT: number = 2000;
}
