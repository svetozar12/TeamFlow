import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { SetResolver } from './set/set.resolver';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      playground: false,
      definitions: {
        path: 'apps/TeamFlowApi/src/graphql.ts',
        outputAs: 'class',
        emitTypenameField: true,
        // skipResolverArgs: true,
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),
  ],
  providers: [SetResolver, PrismaService],
})
export class AppModule {}
