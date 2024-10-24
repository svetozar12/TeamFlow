import {
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GoogleOAuthGuard } from '@apps/TeamFlowApi/src/app/guards/google.guard';
import { Public } from '@apps/TeamFlowApi/src/app/decorators/isPublic';
import { AuthService } from '@apps/TeamFlowApi/src/app/services/auth/auth.service';
import { GithubOAuthGuard } from '@apps/TeamFlowApi/src/app/guards/github.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('google')
  @Public()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    return null;
  }

  @HttpCode(HttpStatus.OK)
  @Get('google/callback')
  @Public()
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req) {
    return this.authService.getOauthData(req);
  }

  @Get('github')
  @Public()
  @UseGuards(GithubOAuthGuard)
  async githubAuth() {
    return null;
  }

  @HttpCode(HttpStatus.OK)
  @Get('github/callback')
  @Public()
  @UseGuards(GithubOAuthGuard)
  githubAuthRedirect(@Request() req) {
    return this.authService.getOauthData(req);
  }
}
