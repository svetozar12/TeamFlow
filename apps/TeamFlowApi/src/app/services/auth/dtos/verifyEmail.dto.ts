import { IsString } from 'class-validator';
import { VerifyEmailInput } from '@apps/TeamFlowApi/src/graphql';

export class VerifyEmailDTO extends VerifyEmailInput {
  @IsString()
  token: string;
}
