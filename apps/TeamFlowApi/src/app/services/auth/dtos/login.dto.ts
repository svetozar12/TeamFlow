import { IsEmail, IsString, ValidateIf, ValidateNested } from 'class-validator';
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

  @ValidateIf((o) => !o.credentials || Object.keys(o.credentials).length === 0)
  @IsString()
  refreshToken: string;
}

// 61ea1833
