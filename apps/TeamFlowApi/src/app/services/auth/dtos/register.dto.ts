import { IsEmail } from 'class-validator';
import { LoginInputLocal } from '@apps/TeamFlowApi/src/graphql';
import { IsSecurePassword } from '@apps/TeamFlowApi/src/app/common/decorators/isSecurePassword.decorator';

export class RegisterDTO extends LoginInputLocal {
  @IsEmail()
  email: string;

  @IsSecurePassword()
  password: string;
}
