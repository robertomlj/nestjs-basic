import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Token } from '../token/entities/token.entity';
import { MailService } from '../mail/mail.service';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,

    private readonly mailService: MailService,
  ) {}

  async forgot(body: ForgotPasswordDto): Promise<any> {
    const user = await this.userRepository.find({
      where: { email: body.email },
    });

    if (user.length === 0) {
      throw new NotFoundException(`E-mail not found`);
    }

    const token = await this.tokenRepository.find({
      where: { type: 'forgot', user: user[0] },
    });

    if (token.length >= 1) {
      const createdAt = moment(token[0].createdAt);
      const limit = createdAt.add(10, 'm');
      const now = moment();

      if (now.isBefore(limit)) {
        throw new NotAcceptableException(
          `There is a another pending request, not allowed`,
        );
      }

      this.tokenRepository.delete(token[0].id);
    }

    const salt = await bcrypt.genSalt();

    const firstCode = await bcrypt.hash(user[0].email, salt);

    const replacer = new RegExp('/', 'g');

    const code = await firstCode.replace(replacer, '');

    const data = { type: 'forgot', code, user: user[0] };

    const entity = this.tokenRepository.create(data);

    await this.tokenRepository.save(entity);

    this.mailService.sendMail(
      user[0],
      code,
      'forgotPassword',
      'Redefinição de senha',
      `${process.env.APP_URL}/auth/reset-password/${code}`,
    );
  }

  async confirmReset(code: string): Promise<any> {
    const token = await this.tokenRepository.find({
      relations: ['user'],
      where: { code: code, type: 'forgot' },
    });

    if (token.length >= 1) {
      this.tokenRepository.delete(token[0].id);

      return { user: token[0].user, success: true };
    }

    return { user: null, success: false };
  }
}
