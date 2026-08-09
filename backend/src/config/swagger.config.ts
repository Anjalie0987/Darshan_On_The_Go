import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class SwaggerEnvironmentVariables {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  SWAGGER_ENABLED: boolean = true;

  @IsString()
  @IsOptional()
  SWAGGER_PATH: string = 'docs';

  @IsString()
  @IsOptional()
  SWAGGER_TITLE: string = 'DarshanHub API';

  @IsString()
  @IsOptional()
  SWAGGER_DESCRIPTION: string = 'The official DarshanHub backend API documentation.';

  @IsString()
  @IsOptional()
  SWAGGER_VERSION: string = '1.0';
}
