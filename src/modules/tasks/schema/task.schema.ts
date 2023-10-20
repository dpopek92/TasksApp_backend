import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export enum TaskStatus {
  UNDONE = 'UNDONE',
  DONE = 'DONE',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.UNDONE })
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

export type TasksDocument = Task & Document & { _id: string; createdAt: Date };
