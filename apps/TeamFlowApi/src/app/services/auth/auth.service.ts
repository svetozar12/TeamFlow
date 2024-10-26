import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  JWT,
  User,
  Profile,
  LoginInputToken,
  Message,
} from '@apps/TeamFlowApi/src/graphql';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { TokenService } from '@apps/TeamFlowApi/src/app/services/tokens/tokens.service';
import { MailService } from '@apps/TeamFlowApi/src/app/services/mail/mail.service';

@Injectable()
export class AuthService {
  private SALT = 10;
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private tokensService: TokenService,
    private mailService: MailService
  ) {}

  async validateUser(
    email: string,
    pass: string
  ): Promise<Omit<User, 'password'>> {
    const user = await this.prismaService.user.findFirst({ where: { email } });
    if (!user) {
      throw new UnauthorizedException();
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

  async register(email: string, password: string): Promise<Message> {
    const user = await this.prismaService.user.findFirst({ where: { email } });
    if (user) {
      throw new UnauthorizedException();
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT);
    const verificationToken = crypto.randomUUID();
    await this.prismaService.user.create({
      data: {
        email,
        accountType: 'Local',
        password: hashedPassword,
        isEnabled: false,
        verificationToken,
      },
    });
    // Send email
    this.mailService.sendEmail(
      email,
      'Email verification',
      null,
      this.getEmailVerificationContent(verificationToken),
      async (err) => {
        if (err) {
          return this.prismaService.user.delete({ where: { email } });
        }
      }
    );

    return { data: 'Successful', __typename: 'Message' };
  }

  async verifyEmail(verificationToken): Promise<JWT> {
    let user = await this.prismaService.user.findFirst({
      where: { verificationToken },
    });
    if (!user) throw new UnauthorizedException('Invalid token');

    user = await this.prismaService.user.update({
      where: { id: user.id },
      data: { isEnabled: true, verificationToken: '' },
    });

    return this.login(user);
  }

  async resetPassword(
    email: string,
    newPassword: string,
    ID: string
  ): Promise<Message> {
    const user = await this.prismaService.user.findFirst({
      where: { email },
      include: { passwordChangeRequest: true },
    });
    const result = await bcrypt.compare(ID, user.passwordChangeRequest.ID);
    if (!result) throw new UnauthorizedException();

    const hashedPassword = await bcrypt.hash(newPassword, this.SALT);
    await this.prismaService.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
    await this.prismaService.passwordChangeRequest.delete({
      where: { userId: user.id },
    });

    return { __typename: 'Message', data: 'Success' };
  }

  private getPasswordResetEmailContent(resetLink: string): string {
    return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          .header {
            background-color: #4c68d7;
            color: #fff;
            padding: 10px;
            text-align: center;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
          }
          .content {
            padding: 20px;
            line-height: 1.6;
          }
          .reset-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4c68d7;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #aaa;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. Please click the link below to reset it:</p>
            <a href="${process.env.FE_URL}/resetPassword?ID=${resetLink}" class="reset-button">Reset Password</a>
            <p>If you didn't request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>Thank you for using our service!</p>
          </div>
        </div>
      </body>
    </html>
  `;
  }

  private getEmailVerificationContent(token: string): string {
    return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          .header {
            background-color: #4c68d7;
            color: #fff;
            padding: 10px;
            text-align: center;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
          }
          .content {
            padding: 20px;
            line-height: 1.6;
          }
          .reset-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4c68d7;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #aaa;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${process.env.FE_URL}/verifyEmail?TOKEN=${token}" class="reset-button">Verify Email</a>
            <p>If you didn't request this email, you can safely ignore it.</p>
          </div>
          <div class="footer">
            <p>Thank you for choosing our service!</p>
          </div>
        </div>
      </body>
    </html>
  `;
  }

  requestResetPassword(email: string): Message {
    const uniqueString = crypto.randomUUID();
    this.mailService.sendEmail(
      email,
      'Password reset',
      null,
      this.getPasswordResetEmailContent(uniqueString),
      async (err) => {
        if (err) return;
        const hashedResetPasswordID = await bcrypt.hash(
          uniqueString,
          this.SALT
        );

        const existingRequest =
          await this.prismaService.passwordChangeRequest.findFirst({
            where: { user: { email } },
          });

        if (existingRequest) {
          await this.prismaService.passwordChangeRequest.delete({
            where: { id: existingRequest.id },
          });
        }

        await this.prismaService.passwordChangeRequest.create({
          data: { user: { connect: { email } }, ID: hashedResetPasswordID },
        });
      }
    );
    return {
      __typename: 'Message',
      data: 'Check your email for reset password link',
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

  getProfile(context: { req: { user: User } }): Profile {
    return { ...context.req.user, __typename: 'Profile' };
  }

  async deleteProfile(context: { req: { user: User } }): Promise<Profile> {
    const userId = context.req.user.id;
    const user = await this.prismaService.user.delete({
      where: { id: userId },
    });

    delete user.password;
    return {
      ...user,
      __typename: 'Profile',
    };
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
