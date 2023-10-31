import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/user/entities/user.entity';
import { EntityManager } from 'typeorm';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userSarvice: UserService,
    private readonly entityManager: EntityManager,
    private readonly jwt: JwtService,
  ) {}

  register(data: CreateUserDto) {
    return this.userSarvice.create(data);
  }

  async login(data: LoginDto) {
    const user: User = await this.entityManager.findOneBy(User, {
      email: data.email,
    });

    if (!user) throw new UnauthorizedException();

    const checkUser: boolean = await compare(data.password, user.password);

    if (!checkUser)
      throw new UnauthorizedException('check your email and password');

    return {
      access_token: this.jwt.sign({ sub: user.id }, {
        expiresIn: 60 * 60 * 24 * 7,
      } as JwtSignOptions),
    };
  }
}
