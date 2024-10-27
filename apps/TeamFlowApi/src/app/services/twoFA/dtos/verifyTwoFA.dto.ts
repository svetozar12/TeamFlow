import { IsString } from 'class-validator';
import { VerifyTwoFAInput } from '@apps/TeamFlowApi/src/graphql';

export class ConfirmTwoFADto extends VerifyTwoFAInput {
  @IsString()
  code: string;
  @IsString()
  tempToken: string;
}
