// gmail-transporter.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Transporter, createTransport, SendMailOptions } from 'nodemailer';
import kleur from 'kleur';

@Injectable()
export class MailService {
  private transporter: Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
    const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_EMAIL,
        pass: GMAIL_PASSWORD,
      },
    });
  }

  sendEmail(
    to: string,
    subject: string,
    text: string,
    html: string,
    callback: (error: Error | null) => void
  ): void {
    const mailOptions: SendMailOptions = {
      from: this.transporter.options.auth.user,
      to,
      subject,
      text,
      html,
    };

    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv !== 'production') {
      this.logger.warn(
        kleur
          .red()
          .bold(
            'EMAIL INTERCEPTED MESSAGE !!!(ONLY IN DEV AND TEST ENVIRONMENT)!!!'
          )
      );
      this.logger.log(
        kleur.blue(`from: ${this.transporter.options.auth.user}`)
      );
      this.logger.log(kleur.blue(`TO: ${to}`));
      this.logger.log(kleur.blue(`SUBJECT: ${subject}`));
      this.logger.log(kleur.blue(`TEXT: ${text}`));
      this.logger.log(kleur.blue(`HTML: ${html}`));
      // mock successful email when working on development or test environment
      return callback(null);
    }

    this.transporter.sendMail(mailOptions, callback);
  }
}
