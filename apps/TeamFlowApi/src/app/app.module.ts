import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { SetModule } from './set/set.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      playground: false,
      formatError: (error) => {
        const originalError = error.extensions?.originalError as {
          message: string;
        };

        if (!originalError) {
          return {
            message: error.message,
            code: error.extensions?.code,
          };
        }
        return {
          message: originalError?.message,
          code: error.extensions?.code,
        };
      },
      definitions: {
        path: 'apps/TeamFlowApi/src/graphql.ts',
        outputAs: 'class',
        emitTypenameField: true,
        // skipResolverArgs: true,
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
    SetModule,
  ],
})
export class AppModule {}
