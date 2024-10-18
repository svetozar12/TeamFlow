import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export class LocalGqlGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    if (!request.body) request.body = {};
    const args = ctx.getArgs();
    request.body = { ...request.body, ...args };
    return request;
  }
}
