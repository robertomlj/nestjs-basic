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
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly mailService: MailService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new HttpException(`User  ID ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async create(user: CreateUserDto): Promise<void> {
    const exists = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (exists) {
      throw new HttpException(
        `email ${user.email} already exists.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const salt = await bcrypt.genSalt();

    const firstCode = await bcrypt.hash(user.email, salt);

    const replacer = new RegExp('/', 'g');

    const code = await firstCode.replace(replacer, '');

    const newUser = { ...user, tokens: [{ code }] };

    const entity = this.userRepository.create(newUser);

    const result = await this.userRepository.save(entity);

    const url = `${process.env.APP_URL}:${process.env.PORT}/token/confirmation/${code}`;

    this.mailService.sendMail(
      result,
      code,
      'confirmation',
      'Confirmação de cadastro',
      url,
    );
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    const entity = await this.userRepository.preload({ id: id, ...user });

    if (!entity) {
      throw new NotFoundException(`User ID ${id} not found`);
    }

    return this.userRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
