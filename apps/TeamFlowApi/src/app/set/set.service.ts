import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Set, SetList } from '@apps/TeamFlowApi/src/graphql';

@Injectable()
export class SetService {
  constructor(private prisma: PrismaService) {}
  async create({ name, year, numParts }: Set): Promise<Set> {
    const newSet = {
      name,
      year,
      numParts: +numParts,
    };
    const data = await this.prisma.set.create({ data: newSet });
    return {
      __typename: 'Set',
      ...data,
    };
  }

  async findAll(): Promise<SetList> {
    const data = (await this.prisma.set.findMany()) as Set[];
    return { __typename: 'SetList', data };
  }
}
