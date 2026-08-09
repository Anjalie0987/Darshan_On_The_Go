import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class SecurityEnvironmentVariables {
  @IsString()
  @IsOptional()
  CORS_ORIGINS: string = '*';

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  RATE_LIMIT_TTL: number = 60000;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  RATE_LIMIT_MAX: number = 100;

  @IsString()
  @IsOptional()
  BODY_LIMIT_JSON: string = '2mb';

  @IsString()
  @IsOptional()
  BODY_LIMIT_URLENCODED: string = '2mb';

  @IsString()
  @IsOptional()
  COOKIE_SECRET: string = 'super-secret-fallback-do-not-use-in-prod';

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  TRUST_PROXY: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  HELMET_ENABLED: boolean = true;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  COMPRESSION_ENABLED: boolean = true;
}
