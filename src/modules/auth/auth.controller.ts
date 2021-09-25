import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('forgout-password')
  forgout(@Body() body: ForgotPasswordDto) {
    return this.authService.forgot(body);
  }
}
