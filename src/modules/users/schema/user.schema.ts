import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 3,
    maxlength: 50,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({ type: String, default: null })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UsersDocument = User & Document & { _id: string };
