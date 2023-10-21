import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ type: String, default: 'test' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  description: string;
}
