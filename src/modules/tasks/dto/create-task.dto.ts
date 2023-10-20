import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ type: String, default: 'test' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
