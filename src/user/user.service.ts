import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, EntityManager } from 'typeorm';
import { ResponseUser, User } from './entities/user.entity';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly entityManager: EntityManager) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user: User = new User(createUserDto);

      const hashPass: string = await hash(user.password, await genSalt(10));

      user.password = hashPass;

      const newUser: User = await this.entityManager.save(user);

      delete newUser.password;

      return newUser;
    } catch (error) {
      if (error.message.includes('duplicate'))
        throw new ConflictException('email is exist');
    }
  }

  async findAll(): Promise<ResponseUser[]> {
    const users = await this.entityManager.find(User);

    return users.map((user) => new ResponseUser(user));
  }

  async findOne(id: number): Promise<ResponseUser> {
    const user: User = await this.entityManager.findOneBy(User, { id });

    return new ResponseUser(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUser> {
    const user: ResponseUser = await this.findOne(id);

    if (!user) throw new NotFoundException('user not found');

    const updatedUser = await this.entityManager.save(User, {
      ...user,
      name: updateUserDto.name,
      email: updateUserDto.email,
    });

    return new ResponseUser(updatedUser);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.entityManager.delete(User, { id });
  }
}
