import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskFieldDto } from './dto/update-task-field.dto';
import { GetUserFromToken } from 'src/common/decorators/get-user-from-token.decorator';
import { JwtPayload } from 'src/common/strategy/access-token.strategy';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { SearchTasksDto } from './dto/search-tasks.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(
    @GetUserFromToken() user: JwtPayload,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create(user.id, createTaskDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(
    @GetUserFromToken() user: JwtPayload,
    @Query() searchTasksDto: SearchTasksDto,
  ) {
    return this.tasksService.findAll(user.id, searchTasksDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':taskId')
  findOne(
    @GetUserFromToken() user: JwtPayload,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.findOne(user.id, taskId);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':taskId')
  updateTask(
    @GetUserFromToken() user: JwtPayload,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(user.id, taskId, updateTaskDto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':taskId')
  update(
    @GetUserFromToken() user: JwtPayload,
    @Param('taskId') taskId: string,
    @Body() updateTaskFieldDto: UpdateTaskFieldDto,
  ) {
    return this.tasksService.updateStatus(user.id, taskId, updateTaskFieldDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':taskId')
  remove(
    @GetUserFromToken() user: JwtPayload,
    @Param('taskId') taskId: string,
  ) {
    return this.tasksService.remove(user.id, taskId);
  }
}
