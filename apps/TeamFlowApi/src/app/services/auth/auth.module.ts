import { Module } from '@nestjs/common';
import { AuthService } from '@apps/TeamFlowApi/src/app/services/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@apps/TeamFlowApi/src/app/services/auth/strategies/local.strategy';
import { AuthResolver } from '@apps/TeamFlowApi/src/app/services/auth/auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@apps/TeamFlowApi/src/app/services/auth/strategies/jwt.strategy';
import { AuthController } from '@apps/TeamFlowApi/src/app/services/auth/auth.controller';
import { GoogleStrategy } from '@apps/TeamFlowApi/src/app/services/auth/strategies/google.strategy';
import { GithubStrategy } from '@apps/TeamFlowApi/src/app/services/auth/strategies/github.strategy';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';
import { TokenService } from '@apps/TeamFlowApi/src/app/services/tokens/tokens.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    AuthResolver,
    PrismaService,
    TokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
