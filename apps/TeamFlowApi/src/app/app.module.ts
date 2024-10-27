import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { AuthModule } from '@apps/TeamFlowApi/src/app/services/auth/auth.module';
import { RedisModule } from '@apps/TeamFlowApi/src/app/databases/redis/redis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TokenCleanupService } from '@apps/TeamFlowApi/src/app/services/tokenCleanup/tokenCleanup.service';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';
import { MailModule } from '@apps/TeamFlowApi/src/app/services/mail/mail.module';
import { TwoFAModule } from '@apps/TeamFlowApi/src/app/services/twoFA/twoFA.module';

@Module({
  imports: [
    MailModule,
    ScheduleModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      introspection: true,
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
    AuthModule,
    TwoFAModule,
    RedisModule.forRoot(),
  ],
  providers: [TokenCleanupService, PrismaService],
})
export class AppModule {}
