import { IsString, Length, ValidateIf, IsOptional } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @IsOptional()
  @IsString()
  @Length(6, 24)
  readonly password?: string;

  @ValidateIf((o) => o.password !== undefined)
  @Match('password')
  readonly confirmPassword?: string;

  // @IsString()
  // readonly isActive?: string;
  // @IsString()
  // readonly accessLevel?: string;
}
