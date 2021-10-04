import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Render,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-in')
  signIn(@Body() body: AuthDto) {
    return this.authService.signIn(body);
  }

  @Public()
  @Post('forgot-password')
  forgot(@Body() body: ForgotPasswordDto) {
    return this.authService.forgot(body);
  }

  @Public()
  @Get('reset-password/:token')
  @Render('resetPassword')
  async confirmReset(@Param('token') token: string) {
    const result = await this.authService.confirmReset(token);

    return { user: result.user, success: result.success };
  }
}
