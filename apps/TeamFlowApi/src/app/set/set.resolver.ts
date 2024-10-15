import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Set } from '@team-flow/apps/TeamFlowApi/src/graphql';

@Resolver('Set')
export class SetResolver {
  private sets: Set[] = [
    {
      id: 1,
      name: 'Voltron',
      numParts: 2300,
      year: 2019,
    },
    {
      id: 2,
      name: 'Ship in a Bottle',
      numParts: 900,
      year: 2019,
    },
  ];

  @Query('allSets')
  getAllSets(): Set[] {
    return this.sets;
  }

  @Mutation()
  addSet(
    @Args('name') name: string,
    @Args('year') year: number,
    @Args('numParts') numParts: number
  ) {
    const newSet = {
      id: this.sets.length + 1,
      name,
      year,
      numParts: +numParts,
    };

    this.sets.push(newSet);

    return newSet;
  }
}
