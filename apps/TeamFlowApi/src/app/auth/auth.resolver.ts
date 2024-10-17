import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '@apps/TeamFlowApi/src/app/guards/gql.guard';
import { User } from '@apps/TeamFlowApi/src/graphql';

@Resolver('Auth')
export class AuthResolver {
  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  login(
    @Args('username') username: string,
    @Args('password') password: string,
    @Context() context
  ): User {
    return { ...context.req.user, __typename: 'User' };
  }
}
