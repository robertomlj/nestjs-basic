import { IsEmail, IsString, Length } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @Length(6, 24)
  readonly password: string;
}
