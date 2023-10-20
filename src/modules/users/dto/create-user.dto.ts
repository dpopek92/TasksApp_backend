import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    minLength: 3,
    maxLength: 50,
    default: 'test@test.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @MinLength(3)
  @MaxLength(50)
  email: string;

  @ApiProperty({
    type: String,
    minLength: 5,
    maxLength: 50,
    default: 'password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  password: string;
}
