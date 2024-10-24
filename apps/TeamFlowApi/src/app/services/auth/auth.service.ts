import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  JWT,
  User,
  Profile,
  LoginInputToken,
} from '@apps/TeamFlowApi/src/graphql';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { TokenService } from '@apps/TeamFlowApi/src/app/services/tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private tokensService: TokenService
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

  async login(user: User): Promise<JWT> {
    const payload = { username: user.email, sub: user.id };
    const expiresIn = 30 * 24 * 60 * 60; // 2592000 seconds

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(
      { message: 'Nothing to be seen here :)' },
      {
        expiresIn: expiresIn,
      }
    );
    await this.tokensService.saveToken(refreshToken, user.id, expiresIn);
    return {
      accessToken,
      refreshToken,
      __typename: 'JWT',
    };
  }

  async loginWithRefreshToken(
    { refreshToken: token }: LoginInputToken,
    context: { req: { user: User } }
  ): Promise<JWT> {
    const userId = await this.tokensService.getToken(token);

    const user = await this.prismaService.user.findFirst({
      where: { id: Number(userId) },
    });
    delete user.password;
    if (!user) throw new UnauthorizedException();

    const expiresIn = 30 * 24 * 60 * 60; // 2592000 seconds

    await this.tokensService.deleteToken(token, Number(userId));

    context.req.user = user;
    const accessToken = this.jwtService.sign(
      { email: user.email },
      {
        expiresIn: '1h',
      }
    );
    const refreshToken = this.jwtService.sign(
      { message: 'Nothing to be seen here :)' },
      {
        expiresIn: expiresIn,
      }
    );
    await this.tokensService.saveToken(refreshToken, Number(userId), expiresIn);
    return {
      accessToken,
      refreshToken,
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
