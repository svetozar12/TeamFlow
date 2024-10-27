import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';
import { JWT, Message, TwoFA, User } from '@apps/TeamFlowApi/src/graphql';
import * as OTPAuth from 'otpauth';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '@apps/TeamFlowApi/src/app/services/tokens/tokens.service';

@Injectable()
export class TwoFAService {
  private TOTP_ISSUER = 'TeamFlowApi';
  private TOTP_LABEL = 'TeamFlow';
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private tokensService: TokenService
  ) {}
  async enable2FA(context: { req: { user: User } }): Promise<TwoFA> {
    const secret = new OTPAuth.Secret({ size: 20 });
    const totp = new OTPAuth.TOTP({
      issuer: this.TOTP_ISSUER,
      label: this.TOTP_LABEL,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret,
    });
    const user = await this.prismaService.user.findFirst({
      where: { id: context.req.user.id },
    });

    if (!user) throw new UnauthorizedException();

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { twoFaSecret: secret.base32 },
    });

    const uri = totp.toString();
    return { __typename: 'TwoFA', otpauth: uri };
  }

  async confirm2FA(
    context: { req: { user: User } },
    userCode: string
  ): Promise<Message> {
    // Fetch the user and their stored twoFaSecret
    const user = await this.prismaService.user.findFirst({
      where: { id: context.req.user.id },
    });
    if (!user || !user.twoFaSecret) throw new UnauthorizedException();

    const totp = new OTPAuth.TOTP({
      issuer: this.TOTP_ISSUER,
      label: this.TOTP_LABEL,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(user.twoFaSecret),
    });

    const isValid = totp.validate({ token: userCode }) !== null;

    if (isValid) {
      await this.prismaService.user.update({
        where: { id: user.id },
        data: { isTwoFaEnabled: true },
      });
    } else {
      throw new UnauthorizedException('Code is invalid');
    }

    return { __typename: 'Message', data: 'Code is valid' };
  }

  async verify2FA(
    context: { req: { user: User } },
    userCode: string,
    tempToken: string
  ): Promise<JWT> {
    const isValidTempToken = this.validateTempToken(
      tempToken,
      context.req.user.id
    );
    if (!isValidTempToken) throw new UnauthorizedException();
    // Fetch the user and their stored twoFaSecret
    const user = await this.prismaService.user.findFirst({
      where: { id: context.req.user.id },
    });
    if (!user || !user.twoFaSecret) throw new UnauthorizedException();

    const totp = new OTPAuth.TOTP({
      issuer: this.TOTP_ISSUER,
      label: this.TOTP_LABEL,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(user.twoFaSecret),
    });

    // Validate the user's TOTP code
    const isValid = totp.validate({ token: userCode }) !== null;

    if (!isValid) {
      throw new UnauthorizedException('Code is invalid');
    }

    const payload = { username: user.email, sub: user.id };
    const expiresIn = 30 * 24 * 60 * 60;

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

    return { __typename: 'JWT', accessToken, refreshToken };
  }

  private validateTempToken(tempToken: string, userId: number): boolean {
    const decoded = this.jwtService.verify(tempToken);
    return decoded.userId === userId;
  }
}
