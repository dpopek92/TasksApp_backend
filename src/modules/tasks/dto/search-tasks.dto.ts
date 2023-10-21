import { IsOptional, IsString, ValidateIf } from 'class-validator';
import { SearchDto } from '../../../common/dto/search.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SearchTasksDto extends SearchDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @ValidateIf((o) => !!o.description)
  @IsString()
  description?: string;
}
