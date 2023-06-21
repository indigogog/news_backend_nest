import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostBodyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CreatePostDto extends CreatePostBodyDto {
  @IsNotEmpty()
  @IsString()
  authorId: string;
}
