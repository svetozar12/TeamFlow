import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github-oauth20';
import { Injectable } from '@nestjs/common';
import { AccountType, User } from '@prisma/client';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly prismaService: PrismaService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = profile;
      const data = {
        email: profile.emails[0].value,
        password: '',
        accountType: AccountType.Github,
      } as User;
      user = await this.prismaService.user.create({ data });
    }
    done(null, { user, accessToken, refreshToken });
  }
}
