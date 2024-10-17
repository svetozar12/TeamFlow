import { Module } from '@nestjs/common';
import { AuthService } from '@apps/TeamFlowApi/src/app/auth/auth.service';
import { UsersModule } from '@apps/TeamFlowApi/src/app/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@apps/TeamFlowApi/src/app/auth/local.strategy';
import { AuthResolver } from '@apps/TeamFlowApi/src/app/auth/auth.resolver';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy, AuthResolver],
})
export class AuthModule {}
