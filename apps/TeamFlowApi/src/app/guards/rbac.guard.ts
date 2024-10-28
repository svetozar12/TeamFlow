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

// example usage in GraphQL resolver
// @Permissions(PermissionFeatureType.UserManagement, 'canRead')

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    // Get feature and action metadata set by @Permissions decorator
    const feature = this.reflector.get<PermissionFeatureType>(
      'feature',
      context.getHandler()
    );
    const action = this.reflector.get<
      'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'
    >('action', context.getHandler());

    // Default to `canRead` if action is not explicitly set
    const actionToCheck = action || 'canRead';
    const isProjectFeature =
      feature === PermissionFeatureType.ProjectManagement;
    // Retrieve project ID from request (assuming it is passed in a way compatible with your setup)
    const projectId = request.params.projectId || request.body.projectId; // Adjust as per your implementation

    // Find the user’s role in the specified project
    const userRole = await this.prismaService.projectUserRole.findFirst({
      where: {
        userId: request.user.id,
        OR: [
          {
            projectId: projectId,
          },
          {
            projectId: null,
          },
        ],
      },
      include: {
        role: {
          include: {
            permissions: {
              where: { feature },
            },
          },
        },
      },
    });

    if (!userRole || (!isProjectFeature && !userRole.role.permissions.length)) {
      throw new UnauthorizedException('No Access');
    }

    // check permissions for specif role
    const rolePermissions = userRole.role.permissions[0];
    return this.handleRbac(rolePermissions, actionToCheck);
  }

  private handleRbac(
    permissions: Permission,
    action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'
  ): boolean {
    return !!permissions && permissions[action];
  }
}
