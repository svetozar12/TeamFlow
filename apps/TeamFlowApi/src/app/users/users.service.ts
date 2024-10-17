import { Injectable } from '@nestjs/common';
import { User } from '@apps/TeamFlowApi/src/graphql';

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User> {
    console.log(username, 'test');
    return this.users.find((user) => user.username === username);
  }
}
