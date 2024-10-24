import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';
import { RedisClientType } from 'redis';
import { RedisClientService } from '@apps/TeamFlowApi/src/app/databases/redis/redis.service';

@Injectable()
export class TokenService {
  private readonly redisClient: RedisClientType;

  constructor(
    private prismaService: PrismaService,
    private readonly redisClientService: RedisClientService
  ) {
    this.redisClient = this.redisClientService.getClient();
  }

  async saveToken(
    token: string,
    userId: number,
    expiresIn: number
  ): Promise<void> {
    await this.redisClient.set(`refreshToken:${token}`, userId, {
      EX: expiresIn,
    });
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    await this.prismaService.whiteList.create({
      data: {
        token,
        expiresAt,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async getToken(token: string): Promise<string | null> {
    const userId = await this.redisClient.get(`refreshToken:${token}`);
    if (userId) return userId;
    const data = await this.prismaService.whiteList.findFirst({
      where: { token },
    });
    if (!data) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return String(data.userId);
  }

  async deleteToken(token: string, userId: number): Promise<void> {
    await this.redisClient.del(`refreshToken:${token}`).catch(() => {
      throw new UnauthorizedException();
    });
    await this.prismaService.whiteList
      .delete({ where: { userId, token } })
      .catch(() => {
        throw new UnauthorizedException();
      });
  }
}
