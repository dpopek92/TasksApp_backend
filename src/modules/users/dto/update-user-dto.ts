import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ValidateIf((o) => !!o.refreshToken)
  @IsString()
  refreshToken?: string;
}
