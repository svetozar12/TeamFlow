import { Module } from '@nestjs/common';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';
import { TwoFAService } from '@apps/TeamFlowApi/src/app/services/twoFA/twoFA.service';
import { TwoFAResolver } from '@apps/TeamFlowApi/src/app/services/twoFA/twoFA.resolver';
import { TokenService } from '@apps/TeamFlowApi/src/app/services/tokens/tokens.service';

@Module({
  providers: [TwoFAService, PrismaService, TwoFAResolver, TokenService],
})
export class ProjectModule {}