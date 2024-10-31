import { Role } from '@prisma/client';
import { prisma } from '../seed';

export async function createRoles() {
  const roles = ['Admin', 'ProjectManager', 'TeamMember', 'Guest'] as const;
  const roleRecords: Partial<
    Record<(typeof roles)[number], { name: string; id: number }>
  > = {};

  for (const roleName of roles) {
    let role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      role = await prisma.role.create({
        data: { name: roleName },
      });
    }
    roleRecords[roleName] = role;
  }

  return roleRecords as Record<
    (typeof roles)[number],
    { name: string; id: number }
  >;
}

export async function createActions(roleRecords: { [key: string]: Role }) {
  const permissions = [
    // User Management Actions for Admin Role
    // {
    //   module: Modules.UserManagement,
    //   action: ActionsEnum.CreateUser,
    //   ownership: { create: { UserManagement: false } },
    //   roles: { connect: [{ id: roleRecords['Admin'].id }] },
    // },
    // {
    //   module: Modules.UserManagement,
    //   action: ActionsEnum.ReadUserProfiles,
    //   ownership: { create: { UserManagement: false } },
    //   roles: { connect: [{ id: roleRecords['Admin'].id }] },
    // },
    // {
    //   module: Modules.UserManagement,
    //   action: ActionsEnum.UpdateUser,
    //   ownership: { create: { UserManagement: false } },
    //   roles: { connect: [{ id: roleRecords['Admin'].id }] },
    // },
    // {
    //   module: Modules.UserManagement,
    //   action: ActionsEnum.DeleteUser,
    //   ownership: { create: { UserManagement: false } },
    //   roles: { connect: [{ id: roleRecords['Admin'].id }] },
    // },
  ];

  // for (const permissionData of permissions) {
  //   const existingAction = await prisma.action.findFirst({
  //     where: {
  //       module: permissionData.module,
  //       action: permissionData.action,
  //     },
  //   });

  //   if (!existingAction) {
  //     await prisma.action.create({
  //       data: permissionData,
  //     });
  //   }
  // }
  console.log(roleRecords, permissions);
}
