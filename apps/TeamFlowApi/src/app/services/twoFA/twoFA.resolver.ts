import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {
  TwoFA,
  VerifyTwoFAInput,
  Message,
  JWT,
} from '@apps/TeamFlowApi/src/graphql';
import { TwoFAService } from '@apps/TeamFlowApi/src/app/services/twoFA/twoFA.service';
import { Public } from '@apps/TeamFlowApi/src/app/decorators/isPublic';
import { ConfirmTwoFADto } from '@apps/TeamFlowApi/src/app/services/twoFA/dtos/confirmTwoFA.dto';

@Resolver('TwoFaAuth')
export class TwoFAResolver {
  constructor(private readonly twoFaService: TwoFAService) {}
  @Mutation(() => TwoFA)
  enableTwoFA(@Context() context): Promise<TwoFA> {
    return this.twoFaService.enable2FA(context);
  }
  @Mutation(() => Message)
  confirmTwoFA(
    @Args('input') { code }: ConfirmTwoFADto,
    @Context() context
  ): Promise<Message> {
    return this.twoFaService.confirm2FA(context, code);
  }
  @Mutation(() => JWT)
  @Public()
  verifyTwoFA(
    @Args('input') { code, tempToken }: VerifyTwoFAInput
  ): Promise<JWT> {
    return this.twoFaService.verify2FA(code, tempToken);
  }
}
