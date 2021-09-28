import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { CreateTokenDto } from './dto/create-token.dto';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async confirmation(code: string) {
    const token = await this.tokenRepository.findOne({
      relations: ['user'],
      where: { code: code, type: 'confirmation', user: { isActive: false } },
    });

    if (token) {
      token.user.isActive = true;

      await this.tokenRepository.save(token);

      this.tokenRepository.delete(token.id);

      return { name: token.user.firstName, success: true };
    }

    return { success: false };
  }
}
