import {
  IsString,
  Length,
  ValidateIf,
  IsOptional,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { Match } from 'src/decorators/match.decorator';
import { Role } from 'src/modules/auth/roles/role.enum';

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

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @IsOptional()
  @MaxLength(20, { each: true })
  readonly roles?: Role[];
}
