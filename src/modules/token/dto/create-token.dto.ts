import { IsString, IsNumber } from 'class-validator';

export class CreateTokenDto {
  @IsString()
  token: string;

  @IsString()
  type: string;

  @IsNumber()
  userId: number;
}
