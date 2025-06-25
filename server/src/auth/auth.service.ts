import { ForbiddenException, Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    login: string,
    password: string,
  ): Promise<Partial<UserEntity> | null> {
    const user = await this.usersService.findByLogin(login);

    if (!user) {
      return null;
    }

    const isPasswordMatch = await compare(password, user.password);

    if (isPasswordMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(dto: CreateUserDto) {
    try {
      const userData = await this.usersService.create({
        ...dto,
        password: this.usersService.hashPassword(dto.password),
      });

      return {
        token: this.jwtService.sign({ id: userData.id }),
      };
    } catch (e) {
      console.error(e);
      throw new ForbiddenException('Registration error');
    }
  }

  login(user: UserEntity) {
    return {
      token: this.jwtService.sign({ id: user.id }),
    };
  }
}
