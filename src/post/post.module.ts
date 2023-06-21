import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ErrorModule } from '../common/error/error.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entity/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), UserModule, ErrorModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [],
})
export class PostModule {}
