import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: parseInt(process.env.MAIL_PORT),
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
          },
        },
        defaults: {
          from: process.env.MAIL_FROM,
        },
        template: {
          dir: `${__dirname}/templates`,
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
    BullModule.registerQueueAsync({
      name: process.env.QUEUE_NAME,
      useFactory: () => ({
        redis: {
          host: process.env.QUEUE_HOST,
          port: parseInt(process.env.QUEUE_PORT),
        },
      }),
    }),
  ],
  controllers: [],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
