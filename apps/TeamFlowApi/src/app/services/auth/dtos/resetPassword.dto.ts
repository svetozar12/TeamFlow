import { IsEmail, IsString } from 'class-validator';
import { ResetPasswordInput } from '@apps/TeamFlowApi/src/graphql';
import { IsSecurePassword } from '@apps/TeamFlowApi/src/app/common/decorators/isSecurePassword.decorator';

export class ResetPasswordDTO extends ResetPasswordInput {
  @IsEmail()
  email: string;

  @IsSecurePassword()
  newPassword: string;

  @IsString()
  ID: string;
}
