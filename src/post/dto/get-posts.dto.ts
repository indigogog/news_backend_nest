import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetPostsDto {
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  count: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  offset: number;
}
