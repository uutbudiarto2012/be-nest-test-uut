import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginDto, LogoutDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { AdminGuard } from 'src/auth/jwt/admin.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }
  @Post('logout')
  logout(@Body() logoutDto: LogoutDto) {
    return this.userService.logout(logoutDto);
  }
  @Post('logout-all')
  logoutAll(@Body() logoutDto: LogoutDto) {
    return this.userService.logoutAll(logoutDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: { page: string; perPage: string; role: Role }) {
    return this.userService.findAll(query);
  }
  @Get('session')
  @UseGuards(JwtAuthGuard)
  getSession(
    @Query() query: { user_id: string; page: string; perPage: string },
  ) {
    return this.userService.getSession(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
