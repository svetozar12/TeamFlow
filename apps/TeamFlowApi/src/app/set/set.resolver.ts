import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Set } from '../../graphql';
import { PrismaService } from '../prisma/prisma.service';

@Resolver('Set')
export class SetResolver {
  constructor(private prisma: PrismaService) {}

  @Query('allSets')
  async getAllSets(): Promise<Set[]> {
    try {
      return this.prisma.set.findMany();
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  @Mutation()
  async addSet(
    @Args('name') name: string,
    @Args('year') year: number,
    @Args('numParts') numParts: number
  ) {
    const newSet = {
      name,
      year,
      numParts: +numParts,
    };

    return this.prisma.set.create({ data: newSet });
  }
}
