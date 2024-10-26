import { IsEmail, IsString, IsJWT, ValidateNested } from 'class-validator';
import {
  LoginInput,
  LoginInputLocal,
  LoginInputToken,
} from '@apps/TeamFlowApi/src/graphql';
import { Type } from 'class-transformer';

export class CredentialsDTO extends LoginInputLocal {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class RefreshTokenDTO extends LoginInputToken {
  @IsJWT()
  refreshToken: string;
}

export class LoginDTO extends LoginInput {
  @ValidateNested()
  @Type(() => CredentialsDTO)
  credentials: CredentialsDTO;

  @ValidateNested()
  @Type(() => RefreshTokenDTO)
  refreshToken: RefreshTokenDTO;
}
