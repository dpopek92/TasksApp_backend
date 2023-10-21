import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { GetUserFromToken } from '../../common/decorators/get-user-from-token.decorator';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { JwtPayload } from '../../common/strategy/access-token.strategy';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getMe(@GetUserFromToken() user: JwtPayload) {
    return this.usersService.getUserById(user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('me')
  deleteMe(@GetUserFromToken() user: JwtPayload) {
    return this.usersService.remove(user.id);
  }
}
