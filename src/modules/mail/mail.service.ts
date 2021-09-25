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

  async sendMail(
    user: User,
    code: string = null,
    action: string,
    subject: string,
    url: string = null,
  ): Promise<void> {
    await this.mailQueue.add('send-mail', { user, code, action, subject, url });
  }
}
