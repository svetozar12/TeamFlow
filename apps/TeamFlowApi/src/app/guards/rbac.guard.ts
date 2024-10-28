import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Permission, PermissionFeatureType } from '@prisma/client';
import { PrismaService } from '@apps/TeamFlowApi/src/app/prisma/prisma.service';

// example usage
// @Permissions(PermissionFeatureType.UserManagement, 'canRead')

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const feature = this.reflector.get<PermissionFeatureType>(
      'feature',
      context.getHandler()
    );
    const action = this.reflector.get<
      'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'
    >('action', context.getHandler());

    // If action is not set, default to `canRead`
    const actionToCheck = action || 'canRead';

    const userRole = await this.prismaService.user.findFirst({
      where: { id: request.user.id },
      include: { roles: { include: { permissions: true } } },
    });

    if (!userRole) throw new UnauthorizedException('No Access');

    // Handle different roles with permissions checks for each
    for (const role of userRole.roles) {
      if (role.name === 'Admin') return true; // Admins have all permissions

      const rolePermissions = role.permissions.find(
        (permission) => permission.feature === feature
      );
      if (rolePermissions && this.handleRbac(rolePermissions, actionToCheck)) {
        return true;
      }
    }

    return false;
  }
  private handleRbac(
    permissions: Permission,
    action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'
  ) {
    if (!permissions) return false;
    return permissions[action];
  }
}
