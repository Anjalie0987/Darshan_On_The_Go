import { IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthEnvironmentVariables {
  @IsString()
  JWT_ACCESS_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  JWT_ACCESS_EXPIRY: string;

  @IsString()
  JWT_REFRESH_EXPIRY: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  BCRYPT_SALT_ROUNDS: number;
}
