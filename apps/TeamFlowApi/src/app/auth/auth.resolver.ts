import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LocalGqlGuard } from '@apps/TeamFlowApi/src/app/guards/local.guard';
import { AuthService } from '@apps/TeamFlowApi/src/app/auth/auth.service';
import { Profile, JWT } from '@apps/TeamFlowApi/src/graphql';
import { Public } from '@apps/TeamFlowApi/src/app/decorators/isPublic';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => String)
  @Public()
  @UseGuards(LocalGqlGuard)
  login(
    @Args('username') username: string,
    @Args('password') password: string,
    @Context() context
  ): JWT {
    return this.authService.login(context.req.user);
  }

  @Query(() => Profile)
  profile(@Context() context): Profile {
    return this.authService.getProfile(context);
  }
}
