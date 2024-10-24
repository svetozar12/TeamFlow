import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';

@Injectable()
export class TokenCleanupService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_2ND_MONTH)
  async deleteExpiredTokens() {
    const now = new Date();

    await this.prisma.whiteList.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });

    console.log('Expired tokens deleted');
  }
}
