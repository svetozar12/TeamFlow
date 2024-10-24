/******************************************************************************
 * Copyright (c) Hilscher Gesellschaft fuer Systemautomation mbH
 * See Hilscher_netFIELD_Source_Code_License.pdf
 ******************************************************************************/

import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisClientService {
  private readonly redisClientProvider: RedisClientType;
  constructor() {
    const client: RedisClientType = createClient({
      url: process.env.REDIS_URL,
      legacyMode: true,
    });

    this.connectClient(client);

    this.redisClientProvider = client;
  }

  private async connectClient(client: RedisClientType): Promise<void> {
    await client.connect();
  }

  public getClient(): RedisClientType {
    return this.redisClientProvider.v4 as RedisClientType;
  }
}
