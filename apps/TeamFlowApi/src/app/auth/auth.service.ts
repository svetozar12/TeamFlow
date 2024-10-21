import { Injectable, Request } from '@nestjs/common';
import { UsersService } from '@apps/TeamFlowApi/src/app/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JWT, User, Profile } from '@apps/TeamFlowApi/src/graphql';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    pass: string
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      console.log(password);
      return result;
    }
    return null;
  }

  async validateUserById(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOneById(id);

    return user;
  }

  login(user: User): JWT {
    const payload = { username: user.username, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload),
      __typename: 'JWT',
    };
  }

  getProfile(context): Profile {
    return { ...context.req.user, __typename: 'Profile' };
  }

  getOauthData(@Request() req) {
    return req.user;
  }
}
