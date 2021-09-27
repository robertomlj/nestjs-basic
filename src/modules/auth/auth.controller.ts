import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('forgot-password')
  forgot(@Body() body: ForgotPasswordDto) {
    return this.authService.forgot(body);
  }

  @Get('reset-password/:token')
  @Render('resetPassword')
  async confirmReset(@Param('token') token: string) {
    const result = await this.authService.confirmReset(token);

    return { user: result.user, success: result.success };
  }
}
