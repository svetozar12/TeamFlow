import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { InternalServerError } from '../../graphql';

@Catch()
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: any): InternalServerError {
    console.error('Error:', exception);
    return {
      __typename: 'InternalServerError',
      message: exception.message,
      status: exception?.status,
    };
  }
}
