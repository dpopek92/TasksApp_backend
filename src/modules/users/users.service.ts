import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { TasksService } from '../tasks/tasks.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { User, UsersDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(User.name) private readonly userModel: Model<UsersDocument>,
    private readonly tasksService: TasksService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);
    return user;
  }

  async getUserById(userId: string) {
    return this.userModel
      .findById(userId)
      .select('-password -refreshToken')
      .lean()
      .exec();
  }

  async getUserByEmail(email: string) {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(userId, updateUserDto, { new: true })
      .select('-password -refreshToken');
  }

  async remove(userId: string) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      await this.userModel.findByIdAndDelete(userId);
      await this.tasksService.removeUserTasks(userId, session);

      await session.commitTransaction();
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      throw new BadRequestException();
    } finally {
      session.endSession();
    }
  }
}
