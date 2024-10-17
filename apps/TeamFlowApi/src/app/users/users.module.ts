import { Module } from '@nestjs/common';
import { UsersService } from '@apps/TeamFlowApi/src/app/users/users.service';

@Module({
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
