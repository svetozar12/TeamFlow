import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {
  TwoFA,
  ConfirmTwoFAInput,
  VerifyTwoFAInput,
  Message,
  JWT,
} from '@apps/TeamFlowApi/src/graphql';
import { TwoFAService } from '@apps/TeamFlowApi/src/app/services/twoFA/twoFA.service';

@Resolver('TwoFaAuth')
export class TwoFAResolver {
  constructor(private readonly twoFaService: TwoFAService) {}
  @Mutation(() => TwoFA)
  enable2FA(@Context() context): Promise<TwoFA> {
    return this.twoFaService.enable2FA(context);
  }
  @Mutation(() => Message)
  confirm2FA(
    @Args('input') { code }: ConfirmTwoFAInput,
    @Context() context
  ): Promise<Message> {
    return this.twoFaService.confirm2FA(context, code);
  }
  @Mutation(() => TwoFA)
  verify2FA(
    @Args('input') { code, tempToken }: VerifyTwoFAInput,
    @Context() context
  ): Promise<JWT> {
    return this.twoFaService.verify2FA(context, code, tempToken);
  }
}
