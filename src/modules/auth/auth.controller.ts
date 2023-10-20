import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { GetUserFromToken } from 'src/common/decorators/get-user-from-token.decorator';
import { AccessTokenGuard } from 'src/common/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { JwtPayload } from 'src/common/strategy/access-token.strategy';
import { RefreshTokenPayload } from 'src/common/strategy/refresh-token';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  refreshToken(@GetUserFromToken() user: RefreshTokenPayload) {
    return this.authService.refreshTokens(user.id, user.refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@GetUserFromToken() user: JwtPayload) {
    return this.authService.logout(user.id);
  }
}
