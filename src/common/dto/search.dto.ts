import { Transform } from 'class-transformer';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { toNumber } from 'lodash';
import { ApiProperty } from '@nestjs/swagger';

export class SearchDto {
  @ApiProperty({ type: Number, default: 5 })
  @IsNotEmpty()
  @Transform(({ value }) => toNumber(value))
  @IsPositive()
  itemsPerPage?: number;

  @ApiProperty({ type: Number, default: 1 })
  @IsNotEmpty()
  @Transform(({ value }) => toNumber(value))
  @IsPositive()
  pageNumber?: number;
}
