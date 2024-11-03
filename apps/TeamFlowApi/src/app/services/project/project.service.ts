import { Injectable } from '@nestjs/common';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';
import { Project } from '../../../graphql';

@Injectable()
export class ProjectService {
  constructor(private prismaService: PrismaService) {}
  async createProject(): Promise<Project> {
    return;
  }
}
