import * as bcrypt from 'bcrypt';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { Base } from '../../database/typeorm/Base';
import { PostEntity } from '../../post/entity/post.entity';

@Entity('user')
export class UserEntity extends Base {
  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => PostEntity, (post) => post.author)
  posts: PostEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
