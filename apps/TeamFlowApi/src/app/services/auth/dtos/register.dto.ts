import { IsEmail } from 'class-validator';
import { LoginCredentialsInput } from '@apps/TeamFlowApi/src/graphql';
import { IsSecurePassword } from '@apps/TeamFlowApi/src/app/common/decorators/isSecurePassword.decorator';

export class RegisterDTO extends LoginCredentialsInput {
  @IsEmail()
  email: string;

  @IsSecurePassword()
  password: string;
}
