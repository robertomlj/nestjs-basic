import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { plainToClass } from 'class-transformer';
import { User } from '../user/entities/user.entity';

@Processor(process.env.QUEUE_NAME)
export class MailProcessor {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly mailerService: MailerService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(
        job.data,
      )}`,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process('send-mail')
  async sendMail(
    job: Job<{ user: User; code: string; action: string; subject: string }>,
  ): Promise<any> {
    this.logger.log(
      `Sending ${job.data.action} e-mail to ${job.data.user.email}`,
    );

    const url = `${process.env.APP_URL}/${job.data.action}/${job.data.code}`;

    try {
      const result = await this.mailerService.sendMail({
        template: `./${job.data.action}`,
        context: {
          ...plainToClass(User, job.data.user),
          url: url,
        },
        subject: job.data.subject,
        to: job.data.user.email,
      });

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send ${job.data.action} email to ${job.data.user.email}`,
        error.stack,
      );
      throw error;
    }
  }
}
//https://firxworx.com/blog/coding/nodejs/email-module-for-nestjs-with-bull-queue-and-the-nest-mailer/
