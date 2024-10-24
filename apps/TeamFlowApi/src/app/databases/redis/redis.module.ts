/******************************************************************************
 * Copyright (c) Hilscher Gesellschaft fuer Systemautomation mbH
 * See Hilscher_netFIELD_Source_Code_License.pdf
 ******************************************************************************/

import { DynamicModule, Module } from '@nestjs/common';
import { RedisClientService } from './redis.service';

@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    return {
      module: RedisModule,
      global: true,
      providers: [RedisClientService],
      exports: [RedisClientService],
    };
  }
}
