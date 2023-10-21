import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, FilterQuery, FlattenMaps, Model } from 'mongoose';
import { ISearchResult } from '../../common/interfaces/search.interface';
import { getPaginationParams } from '../../common/utils/pagination.utils';
import { CreateTaskDto } from './dto/create-task.dto';
import { SearchTasksDto } from './dto/search-tasks.dto';
import { UpdateTaskFieldDto } from './dto/update-task-field.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TasksDocument } from './schema/task.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TasksDocument>,
  ) {}

  create(userId: string, createTaskDto: CreateTaskDto) {
    return this.taskModel.create({ ...createTaskDto, user: userId });
  }

  async findAll(
    userId: string,
    searchTasksDto: SearchTasksDto,
  ): Promise<ISearchResult<FlattenMaps<TasksDocument>>> {
    const searchQuery: FilterQuery<TasksDocument> = { user: userId };
    if (searchTasksDto.description)
      searchQuery.description = {
        $regex: searchTasksDto.description,
        $options: 'i',
      };

    const tasksCount = await this.taskModel.countDocuments(searchQuery);
    const { skipped, itemsPerPage, totalItems } = getPaginationParams(
      searchTasksDto.pageNumber,
      searchTasksDto.itemsPerPage,
      tasksCount,
    );

    const tasks = await this.taskModel
      .find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skipped)
      .limit(itemsPerPage)
      .lean()
      .exec();

    return {
      content: tasks,
      searchParams: {
        totalItems,
        itemsPerPage,
        pageNumber: searchTasksDto.pageNumber,
      },
    };
  }

  findOne(userId: string, taskId: string) {
    return this.taskModel.findOne({ user: userId, _id: taskId }).lean().exec();
  }

  update(userId: string, taskId: string, updateTaskDto: UpdateTaskDto) {
    return this.taskModel
      .findOneAndUpdate({ user: userId, _id: taskId }, updateTaskDto, {
        new: true,
        upsert: true,
      })
      .lean()
      .exec();
  }

  updateField(
    userId: string,
    taskId: string,
    updateTaskFieldDto: UpdateTaskFieldDto,
  ) {
    return this.taskModel
      .findOneAndUpdate(
        { user: userId, _id: taskId },
        { ...updateTaskFieldDto },
        {
          new: true,
        },
      )
      .lean()
      .exec();
  }

  remove(userId: string, taskId: string) {
    return this.taskModel.findOneAndRemove({ user: userId, _id: taskId });
  }

  removeUserTasks(userId: string, session: ClientSession) {
    return this.taskModel.deleteMany({ user: userId }, { session });
  }
}
