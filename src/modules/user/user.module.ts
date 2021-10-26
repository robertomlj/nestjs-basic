import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailModule } from '../mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { CanAdminUpdateGuard } from 'src/guards/can-admin-update.guard';
import { UpdateMySelfGuard } from 'src/guards/update-my-self.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: CanAdminUpdateGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
