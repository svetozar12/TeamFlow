import { IsEmail, IsString, ValidateNested } from 'class-validator';
import {
  LoginInput,
  LoginCredentialsInput,
} from '@apps/TeamFlowApi/src/graphql';
import { Type } from 'class-transformer';

export class CredentialsDTO extends LoginCredentialsInput {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class LoginDTO extends LoginInput {
  @ValidateNested()
  @Type(() => CredentialsDTO)
  credentials: CredentialsDTO;

  @IsString()
  refreshToken: string;
}
