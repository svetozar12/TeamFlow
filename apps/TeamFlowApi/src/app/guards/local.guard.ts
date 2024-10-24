import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

export class LocalGqlGuard extends AuthGuard('local') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    if (!request.body) request.body = {};
    const args = ctx.getArgs();
    request.body = { ...request.body, ...args };

    if (request.body.refreshToken) {
      // Skip the authentication if refreshToken is present
      return null;
    }

    return request;
  }

  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    if (!request.body) request.body = {};
    const args = ctx.getArgs();
    request.body = { ...request.body, ...args };
    if (request.body.input?.refreshToken?.refreshToken) {
      // Skip the authentication if refreshToken is present
      return true;
    }

    return super.canActivate(context);
  }
}
