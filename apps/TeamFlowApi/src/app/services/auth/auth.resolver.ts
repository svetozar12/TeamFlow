import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LocalGqlGuard } from '@apps/TeamFlowApi/src/app/guards/local.guard';
import { AuthService } from '@apps/TeamFlowApi/src/app/services/auth/auth.service';
import {
  Profile,
  JWT,
  Message,
  TwoFAJWT,
  LoginWithBackupCodeInput,
} from '@apps/TeamFlowApi/src/graphql';
import { Public } from '@apps/TeamFlowApi/src/app/decorators/isPublic';
import { RegisterDTO } from '@apps/TeamFlowApi/src/app/services/auth/dtos/register.dto';
import { ResetPasswordDTO } from '@apps/TeamFlowApi/src/app/services/auth/dtos/resetPassword.dto';
import { VerifyEmailDTO } from '@apps/TeamFlowApi/src/app/services/auth/dtos/verifyEmail.dto';
import { RequestPasswordResetDto } from '@apps/TeamFlowApi/src/app/services/auth/dtos/requestPasswordReset.dto';
import { LoginDTO } from '@apps/TeamFlowApi/src/app/services/auth/dtos/login.dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => JWT)
  @Public()
  @UseGuards(LocalGqlGuard)
  login(
    @Args('input') input: LoginDTO,
    @Context() context
  ): Promise<JWT | TwoFAJWT> {
    if (input?.refreshToken)
      return this.authService.loginWithRefreshToken(
        input.refreshToken,
        context
      );
    return this.authService.login(context.req.user);
  }

  @Mutation(() => JWT)
  @Public()
  loginWithBackupCode(
    @Args('input') { backupCode, email, password }: LoginWithBackupCodeInput
  ): Promise<JWT> {
    return this.authService.loginWithBackupCode(email, backupCode, password);
  }

  @Mutation(() => JWT)
  @Public()
  verifyEmail(@Args('input') { token }: VerifyEmailDTO): Promise<JWT> {
    return this.authService.verifyEmail(token);
  }

  @Mutation(() => Message)
  @Public()
  register(@Args('input') { email, password }: RegisterDTO): Promise<Message> {
    return this.authService.register(email, password);
  }

  @Mutation(() => Profile)
  async deleteProfile(@Context() context): Promise<Profile> {
    return this.authService.deleteProfile(context);
  }

  @Mutation(() => Message)
  @Public()
  async resetPassword(
    @Args('input') { email, newPassword, ID }: ResetPasswordDTO
  ): Promise<Message> {
    return this.authService.resetPassword(email, newPassword, ID);
  }

  @Mutation(() => Message)
  @Public()
  async requestPasswordReset(
    @Args('input') { email }: RequestPasswordResetDto
  ): Promise<Message> {
    return this.authService.requestResetPassword(email);
  }

  @Query(() => Profile)
  profile(@Context() context): Profile {
    return this.authService.getProfile(context);
  }
}
