import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTokenDto } from './dto/create-token.dto';
import { Token } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  findAll(): Promise<Token[]> {
    return this.tokenRepository.find();
  }

  findOne(id: string): Promise<Token> {
    return this.tokenRepository.findOne(id);
  }

  async create(token: CreateTokenDto): Promise<void> {
    const entity = this.tokenRepository.create(token);

    await this.tokenRepository.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.tokenRepository.delete(id);
  }
}
