import { IsEmail } from 'class-validator';
import { RequestResetPasswordInput } from '@apps/TeamFlowApi/src/graphql';

export class RequestResetPasswordDTO extends RequestResetPasswordInput {
  @IsEmail()
  email: string;
}
