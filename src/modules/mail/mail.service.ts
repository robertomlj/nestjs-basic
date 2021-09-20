import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { User } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue(process.env.QUEUE_NAME)
    private mailQueue: Queue,
  ) {}

  async sendConfirmationEmail(user: User, code: string): Promise<void> {
    await this.mailQueue.add('confirmation', { user, code });
  }
}
