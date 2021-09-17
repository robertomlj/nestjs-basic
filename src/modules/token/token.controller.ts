import { Controller, Get } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('tokens')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Get()
  async findAll(): Promise<any> {
    await this.tokenService.findAll();
  }
}
