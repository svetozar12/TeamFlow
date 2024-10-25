import { Module } from '@nestjs/common';
import { MailService } from '@apps/TeamFlowApi/src/app/services/mail/mail.service';

@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
