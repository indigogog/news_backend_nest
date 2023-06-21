import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ENDPOINTS,
  GLOBAL_PREFIXES,
} from '../common/constants/endpoints.consts';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller(GLOBAL_PREFIXES.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(ENDPOINTS.USER.ALL)
  async all() {
    return await this.userService.all();
  }

  @Post(ENDPOINTS.USER.CREATE)
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Patch(ENDPOINTS.USER.UPDATE)
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.userService.update(id, dto);
  }

  @Delete(ENDPOINTS.USER.REMOVE)
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}
