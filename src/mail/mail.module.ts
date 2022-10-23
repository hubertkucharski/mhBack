import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { config as localConfig } from '../../config/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          ignoreTLS: true,
          secure: true,
          auth: {
            user: localConfig.MAIL_USER,
            pass: localConfig.MAIL_SECRET,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: 'megakauth@gmail.com',
        },
        template: {
          dir: './templates/email',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
