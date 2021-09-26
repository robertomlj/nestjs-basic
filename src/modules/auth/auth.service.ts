import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async forgot(body: ForgotPasswordDto): Promise<any> {
    const user = await this.userRepository.find({
      where: { email: body.email },
    });

    if (user.length === 0) {
      throw new NotFoundException(`E-mail not found`);
    }

    const salt = await bcrypt.genSalt();

    const firstCode = await bcrypt.hash(user[0].email, salt);

    const replacer = new RegExp('/', 'g');

    const code = await firstCode.replace(replacer, '');

    console.log(user);
  }
}
