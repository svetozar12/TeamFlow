import { Module } from '@nestjs/common';
import { SetResolver } from './set.resolver';
import { SetService } from './set.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [],
  providers: [SetResolver, SetService, PrismaService],
})
export class SetModule {}
