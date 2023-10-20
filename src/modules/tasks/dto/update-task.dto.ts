import { IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../schema/task.schema';
import { CreateTaskDto } from './create-task.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends CreateTaskDto {
  @ApiProperty({ enum: TaskStatus, default: TaskStatus.DONE })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
