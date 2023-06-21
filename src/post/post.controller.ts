import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ENDPOINTS,
  GLOBAL_PREFIXES,
} from '../common/constants/endpoints.consts';
import { PostService } from './post.service';
import { CreatePostBodyDto } from './dto/create-post.dto';
import { CurrentUser, Public } from '../authorization/jwt/decorators';
import { User } from '../types/User.type';
import { GetPostsDto } from './dto/get-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller(GLOBAL_PREFIXES.POST)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(ENDPOINTS.POST.CREATE)
  async create(@Body() dto: CreatePostBodyDto, @CurrentUser() user: User) {
    return await this.postService.create({ ...dto, authorId: user.id });
  }

  @Public()
  @Get(ENDPOINTS.POST.ALL)
  async all(@Query() dto: GetPostsDto) {
    return await this.postService.all(dto);
  }

  @Patch(ENDPOINTS.POST.UPDATE)
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return await this.postService.update(id, dto);
  }

  @Delete(ENDPOINTS.POST.REMOVE)
  async remove(@Param('id') id: string) {
    return await this.postService.remove(id);
  }
}
