import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LocalGqlGuard } from '@apps/TeamFlowApi/src/app/guards/local.guard';
import { AuthService } from '@apps/TeamFlowApi/src/app/services/auth/auth.service';
import {
  Profile,
  JWT,
  LoginInput,
  Message,
} from '@apps/TeamFlowApi/src/graphql';
import { Public } from '@apps/TeamFlowApi/src/app/decorators/isPublic';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => JWT)
  @Public()
  @UseGuards(LocalGqlGuard)
  login(@Args('input') input: LoginInput, @Context() context): Promise<JWT> {
    if (input?.refreshToken?.refreshToken)
      return this.authService.loginWithRefreshToken(
        input.refreshToken,
        context
      );
    return this.authService.login(context.req.user);
  }

  @Mutation(() => JWT)
  @Public()
  verifyEmail(@Args('token') token: string): Promise<JWT> {
    return this.authService.verifyEmail(token);
  }

  @Mutation(() => Message)
  @Public()
  register(
    @Args('email') email: string,
    @Args('password') password: string
  ): Promise<Message> {
    return this.authService.register(email, password);
  }

  @Mutation(() => Profile)
  async deleteProfile(@Context() context): Promise<Profile> {
    return this.authService.deleteProfile(context);
  }

  @Mutation(() => Message)
  @Public()
  async resetPassword(
    @Args('email') email: string,
    @Args('newPassword') newPassword: string,
    @Args('ID') ID: string
  ): Promise<Message> {
    return this.authService.resetPassword(email, newPassword, ID);
  }

  @Mutation(() => Message)
  @Public()
  async requestResetPassword(@Args('email') email: string): Promise<Message> {
    return this.authService.requestResetPassword(email);
  }

  @Query(() => Profile)
  profile(@Context() context): Profile {
    return this.authService.getProfile(context);
  }
}
