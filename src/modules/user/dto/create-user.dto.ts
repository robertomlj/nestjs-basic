import {
  IsString,
  IsEmail,
  Length,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class CreateUserDto {
  @IsString()
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(6, 24)
  readonly password: string;

  // @ValidateIf((o) => o.password !== '')
  // @IsNotEmpty()
  @IsString()
  @Length(6, 24)
  @Match('password')
  readonly confirmPassword: string;
}
