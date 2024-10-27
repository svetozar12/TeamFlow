import { IsEmail } from 'class-validator';
import { RequestPasswordResetInput } from '@apps/TeamFlowApi/src/graphql';

export class RequestPasswordResetDto extends RequestPasswordResetInput {
  @IsEmail()
  email: string;
}
