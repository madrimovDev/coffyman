import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { Role } from '@prisma/client';
import { Protected } from 'src/common/decorator/protected.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('me')
  @HttpCode(200)
  @Protected({
    roles: [Role.ADMIN, Role.USER],
  })
  findMe(@CurrentUser('sub') userId: string) {
    return this.userService.findMe(userId);
  }

  @Protected({
    roles: [Role.ADMIN],
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Protected({
    roles: [Role.ADMIN],
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Protected({
    roles: [Role.ADMIN],
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Protected({
    roles: [Role.ADMIN],
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
