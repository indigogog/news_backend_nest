import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';
import { Repository } from 'typeorm';
import { ErrorService } from '../common/error/error.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UserService } from '../user/user.service';
import { GetPostsDto } from './dto/get-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { removeNullFromProperties } from '../common/utils/utils';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
    private readonly userService: UserService,
    private readonly errorService: ErrorService,
  ) {}

  async create({ content, title, authorId }: CreatePostDto) {
    try {
      const entity = this.postRepository.create({ content, title });
      const author = await this.userService.getBy({ id: authorId });
      entity.author = author.user;
      const savedPost = await this.postRepository.save(entity);
      return this.errorService.success('Success', { post: savedPost });
    } catch (e) {
      throw this.errorService.internal('Create post error', e.message);
    }
  }

  async all({ count, offset }: GetPostsDto) {
    try {
      const posts = await this.postRepository.find({
        skip: offset,
        take: count,
      });
      return this.errorService.success('Success', { posts });
    } catch (e) {
      throw this.errorService.internal('Get posts error', e.message);
    }
  }

  async update(id: string, dto: UpdatePostDto) {
    try {
      if (!dto.title && !dto.content)
        throw this.errorService.badRequest('Nothing for update');
      await this.postRepository.update({ id }, { ...removeNullFromProperties(dto) });
      const updatedPost = await this.postRepository.findOne({ where: { id } });
      return this.errorService.success('Success', { updatedPost });
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw this.errorService.internal('Update post error', e.message);
    }
  }

  async remove(id: string) {
    try {
      const post = await this.postRepository.delete({ id });
      return this.errorService.success('Success', { post });
    } catch (e) {
      throw this.errorService.internal('Remove post error', e.message);
    }
  }
}
