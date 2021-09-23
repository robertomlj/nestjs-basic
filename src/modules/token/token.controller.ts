import { Controller, Get, Param, Render } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  @Get('confirmation/:code')
  @Render('confirmation')
  async confirmation(@Param() params) {
    const result = await this.tokenService.confirmation(params.code);

    if (result.success) {
      return { name: result.name, success: true };
    }

    return { success: false };
  }
}
