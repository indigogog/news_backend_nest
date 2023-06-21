import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from '../../database/typeorm/Base';
import { UserEntity } from '../../user/enitity/user.entity';

@Entity('post')
export class PostEntity extends Base {
  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  author: UserEntity;
}
