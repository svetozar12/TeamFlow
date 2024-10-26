import { Catch, BadRequestException, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { InternalServerError } from '../../graphql';

@Catch()
export class GraphqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException): InternalServerError {
    console.error('Error:', exception);

    let errorMessage = exception.message;
    let errorStatus = 500;
    let errorDetails;

    if (exception instanceof BadRequestException) {
      console.log('BadRequestException');
      const response = exception.getResponse() as {
        statusCode: number;
        error: string;
        message: string[];
      };
      errorStatus = response?.statusCode;
      errorMessage = response?.error;
      errorDetails = response?.message;
    } else if (exception instanceof HttpException) {
      errorMessage = exception.message;
      errorStatus = exception.getStatus();
    }

    return {
      __typename: 'InternalServerError',
      message: errorMessage,
      status: errorStatus,
      details: errorDetails,
    };
  }
}
