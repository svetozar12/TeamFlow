import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';
import { JWT, ConfirmTwoFA, TwoFA, User } from '@apps/TeamFlowApi/src/graphql';
import * as OTPAuth from 'otpauth';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '@apps/TeamFlowApi/src/app/services/tokens/tokens.service';
import * as crypto from 'crypto';
import bcrypt from 'bcrypt';

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
  ): Promise<ConfirmTwoFA> {
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

    const backupCodes = this.generateBackupCodes();
    const hashedBackupCodes = await this.hashBackupCodes(backupCodes);
    await this.prismaService.user.update({
      where: { id: context.req.user.id },
      data: { hashedBackupCodes },
    });
    return { __typename: 'ConfirmTwoFA', backupCodes };
  }

  async verify2FA(userCode: string, tempToken: string): Promise<JWT> {
    const isValidTempToken = this.validateTempToken(tempToken);
    if (!isValidTempToken) throw new UnauthorizedException();
    // Fetch the user and their stored twoFaSecret
    const user = await this.prismaService.user.findFirst({
      where: { id: isValidTempToken.sub },
    });
    if (!user || !user.twoFaSecret) throw new UnauthorizedException();
    console.log(user, 'Hello');
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

    const payload = {
      username: user.email,
      sub: user.id,
      twoFa: user.isTwoFaEnabled,
    };
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

  private validateTempToken(tempToken: string) {
    return this.jwtService.verify(tempToken);
  }

  private generateBackupCodes(count = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex');
      codes.push(code);
    }
    return codes;
  }

  private async hashBackupCodes(codes): Promise<string[]> {
    const hashedCodes: string[] = [];
    for (const code of codes) {
      const hash = await bcrypt.hash(code, 10);
      hashedCodes.push(hash);
    }
    return hashedCodes;
  }
}
