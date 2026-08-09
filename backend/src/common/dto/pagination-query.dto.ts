import { IsEnum, IsInt, IsOptional, Max, Min, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { SortDirection } from '../enums/common.enum';
import { APP_CONSTANTS } from '../constants/app.constants';

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = APP_CONSTANTS.DEFAULT_PAGE;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(APP_CONSTANTS.MAX_LIMIT)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = APP_CONSTANTS.DEFAULT_LIMIT;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsEnum(SortDirection)
  sortDirection?: SortDirection = SortDirection.DESC;
}
