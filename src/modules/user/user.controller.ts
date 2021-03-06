import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CanAdminUpdate } from 'src/decorators/can-admin-update.decorator';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UpdateMySelfGuard } from 'src/guards/update-my-self.guard';
import { Role } from '../auth/roles/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(Role.Admin, Role.User)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.userService.findOne(id);
  }

  @Public()
  @Post()
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.User)
  @UseGuards(UpdateMySelfGuard)
  @CanAdminUpdate('roles', 'isActive')
  update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.userService.remove(id);
  }
}
