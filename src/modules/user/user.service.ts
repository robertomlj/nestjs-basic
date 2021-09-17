import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);

    if (!user) {
      throw new HttpException(`User  ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async create(user: CreateUserDto): Promise<void> {
    const exists = await this.usersRepository.find({
      where: { email: user.email },
    });

    if (exists.length >= 1) {
      throw new HttpException(
        `email ${user.email} already exists.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt();

    const firstCode = await bcrypt.hash(user.email, salt);

    const code = firstCode.replace('/', '');

    const newUser = { ...user, tokens: [{ code, type: 'active' }] };

    const entity = this.usersRepository.create(newUser);

    await this.usersRepository.save(entity);
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    const entity = await this.usersRepository.preload({ id: id, ...user });

    if (!entity) {
      throw new NotFoundException(`User ID ${id} not found`);
    }

    return this.usersRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
