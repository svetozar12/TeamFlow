import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Action, ActionsEnum, Modules, Prisma } from '@prisma/client';
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
    const module = this.reflector.get<Modules>('feature', context.getHandler());
    const action = this.reflector.get<ActionsEnum>(
      'action',
      context.getHandler()
    );

    // Default to `canRead` if action is not explicitly set
    const actionToCheck = action;
    const isProjectModule = module === Modules.ProjectManagement;
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
            actions: {
              where: { action },
              include: { ownership: true },
            },
          },
        },
      },
    });

    if (!userRole || (!isProjectModule && !userRole.role.actions.length)) {
      throw new UnauthorizedException('No Access');
    }

    // check permissions for specif role
    const rolePermissions = userRole.role.actions[0];
    return this.handleRbac(userRole, rolePermissions, actionToCheck, projectId);
  }

  private async handleRbac(
    userRole: Prisma.ProjectUserRoleGetPayload<{
      include: {
        role: {
          include: {
            actions: {
              where: { action };
              include: { ownership: true };
            };
          };
        };
      };
    }>,
    permissions: Action,
    action: ActionsEnum,
    projectId: number
  ): Promise<boolean> {
    const { id: _, actionId: _1, ...rest } = userRole.role.actions[0].ownership;

    if (rest.ProjectManagement) {
      const { ownerId } = await this.prismaService.project.findFirst({
        where: { id: projectId },
      });

      if (ownerId !== userRole.userId) {
        throw new UnauthorizedException('No Access');
      }
    }

    return !!permissions && permissions[action];
  }
}
