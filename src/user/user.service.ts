import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from './enitity/user.entity';
import { ErrorService } from '../common/error/error.service';
import { FindParams } from './user.types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { removeNullFromProperties } from '../common/utils/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly errorService: ErrorService,
  ) {}

  async all() {
    try {
      const users = await this.userRepository.find();
      return this.errorService.success('Success', { users });
    } catch (e) {
      throw this.errorService.internal('Get users error', e.message);
    }
  }

  async getBy(
    where: FindOptionsWhere<UserEntity>,
    { withPassword }: FindParams = { withPassword: false },
  ) {
    try {
      const user = await this.userRepository.findOne({
        where,
        select: {
          id: true,
          password: withPassword,
          email: true,
          dateDeleted: true,
          dateCreated: true,
          dateUpdated: true,
          firstname: true,
          lastname: true,
        },
      });

      return this.errorService.success('Success', { user });
    } catch (e) {
      throw this.errorService.internal('Get user error', e.message);
    }
  }

  async create(dto: CreateUserDto) {
    try {
      const duplicate = await this.userRepository.findOneBy({
        email: dto.email,
      });
      if (duplicate) {
        throw this.errorService.badRequest(`E-mail ${dto.email} already exist`);
      }

      const entity = this.userRepository.create(dto);
      const savedUser = await this.userRepository.save(entity);

      return this.errorService.success('Success', { user: savedUser });
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw this.errorService.internal('Create user error', e.message);
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      const user = await this.userRepository.save({
        id,
        ...removeNullFromProperties(dto),
      });
      return this.errorService.success('Success', { user });
    } catch (e) {
      throw this.errorService.internal('Update user error', e.message);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.delete({ id });
      return this.errorService.success('Success', { user });
    } catch (e) {
      throw this.errorService.internal('Remove user error', e.message);
    }
  }
}
