import { Module } from '@nestjs/common';
import { AuthService } from '@apps/TeamFlowApi/src/app/auth/auth.service';
import { UsersModule } from '@apps/TeamFlowApi/src/app/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@apps/TeamFlowApi/src/app/auth/local.strategy';
import { AuthResolver } from '@apps/TeamFlowApi/src/app/auth/auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@apps/TeamFlowApi/src/app/auth/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
