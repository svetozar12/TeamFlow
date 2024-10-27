import { IsString } from 'class-validator';
import { ConfirmTwoFAInput } from '@apps/TeamFlowApi/src/graphql';

export class ConfirmTwoFADto extends ConfirmTwoFAInput {
  @IsString()
  code: string;
}
