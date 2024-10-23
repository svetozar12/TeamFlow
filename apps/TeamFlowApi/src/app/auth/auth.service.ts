import { Injectable, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  JWT,
  User,
  Profile,
  LoginInputToken,
} from '@apps/TeamFlowApi/src/graphql';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    pass: string
  ): Promise<Omit<User, 'password'>> {
    let user: User;
    user = await this.prismaService.user.findFirst({ where: { email } });
    if (!user) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(pass, saltRounds);
      user = await this.prismaService.user.create({
        data: { email, password: hashedPassword },
      });
    }
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password: _password, ...result } = user;
      return { ...result, __typename: 'User' };
    }
    return null;
  }

  async validateUserById(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.prismaService.user.findFirst({ where: { id } });

    return { ...user, __typename: 'User' };
  }

  login(user: User): JWT {
    const payload = { username: user.email, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '90d' }),
      __typename: 'JWT',
    };
  }

  loginWithRefreshToken({ refreshToken: _ }: LoginInputToken): JWT {
    return {
      accessToken: 'login with refresh token',
      refreshToken: '',
      __typename: 'JWT',
    };
  }

  getProfile(context): Profile {
    return { ...context.req.user, __typename: 'Profile' };
  }

  getOauthData(@Request() req): JWT {
    const payload = req.user;
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '90d' }),
      __typename: 'JWT',
    };
  }
}
