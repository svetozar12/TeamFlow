import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Set, SetList } from '../../graphql';
import { SetService } from './set.service';

@Resolver('Set')
export class SetResolver {
  constructor(private setService: SetService) {}

  @Query('sets')
  async sets(): Promise<SetList> {
    return this.setService.findAll();
  }
  @Mutation()
  async addSet(
    @Args('name') name: string,
    @Args('year') year: number,
    @Args('numParts') numParts: number
  ): Promise<Set> {
    return this.setService.create({ name, year, numParts });
  }
}
