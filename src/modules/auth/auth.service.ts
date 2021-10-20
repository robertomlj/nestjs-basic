import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Token } from '../token/entities/token.entity';
import { MailService } from '../mail/mail.service';
import * as moment from 'moment';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,

    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(body: AuthDto): Promise<any> {
    const { email, password } = body;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User ${email} not found.`);
    }

    if (!user.isActive) {
      throw new UnauthorizedException(`User not actived.`);
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      throw new UnauthorizedException(`Password is wrong.`);
    }

    return {
      access_token: this.jwtService.sign({
        isActive: user.isActive,
        sub: user.id,
        roles: user.roles,
      }),
    };
  }

  async forgot(body: ForgotPasswordDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: body.email },
    });

    if (!user) {
      throw new NotFoundException(`E-mail not found`);
    }

    const token = await this.tokenRepository.findOne({
      where: { type: 'forgot', user: user },
    });

    if (token) {
      const createdAt = moment(token.createdAt);
      const limit = createdAt.add(10, 'm');
      const now = moment();

      if (now.isBefore(limit)) {
        throw new NotAcceptableException(
          `There is a another pending request, not allowed`,
        );
      }

      this.tokenRepository.delete(token.id);
    }

    const salt = await bcrypt.genSalt();

    const firstCode = await bcrypt.hash(user.email, salt);

    const replacer = new RegExp('/', 'g');

    const code = await firstCode.replace(replacer, '');

    const data = { type: 'forgot', code, user: user };

    const entity = this.tokenRepository.create(data);

    await this.tokenRepository.save(entity);

    this.mailService.sendMail(
      user,
      code,
      'forgotPassword',
      'Redefinição de senha',
      `${process.env.APP_URL}/auth/reset-password/${code}`,
    );
  }

  async confirmReset(code: string): Promise<any> {
    const token = await this.tokenRepository.findOne({
      relations: ['user'],
      where: { code: code, type: 'forgot' },
    });

    if (token) {
      this.tokenRepository.delete(token.id);

      return { user: token.user, success: true };
    }

    return { user: null, success: false };
  }
}
