import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findByLogin(login: string) {
    return this.repository.findOne({
      where: {
        login,
      },
    });
  }

  async findById(id: number) {
    const findUser = await this.repository.findOne({
      where: {
        id,
      },
    });

    if (!findUser) {
      throw new Error('User not found');
    }

    return { id: findUser.id, login: findUser.login, name: findUser.name };
  }

  hashPassword(password: string) {
    return hashSync(password, 10);
  }

  async create(createUserDto: CreateUserDto) {
    return this.repository.save(createUserDto);
  }
}
