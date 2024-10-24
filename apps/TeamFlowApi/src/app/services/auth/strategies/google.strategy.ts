import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';
import { AccountType, User } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly prismaService: PrismaService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: User & { emails: [{ value: string }] },
    done: VerifyCallback
  ): Promise<void> {
    let user: User;

    user = await this.prismaService.user.findFirst({
      where: { email: profile.email },
    });
    if (!user) {
      const data = {
        email: profile.emails[0].value,
        password: '',
        accountType: AccountType.Google,
      };
      user = await this.prismaService.user.create({ data });
    }

    done(null, { user, accessToken, refreshToken });
  }
}
