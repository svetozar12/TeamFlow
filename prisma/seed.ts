import { PermissionFeatureType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Define the roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin' },
  });

  const projectManagerRole = await prisma.role.upsert({
    where: { name: 'Project Manager' },
    update: {},
    create: { name: 'Project Manager' },
  });

  const teamMemberRole = await prisma.role.upsert({
    where: { name: 'Team Member' },
    update: {},
    create: { name: 'Team Member' },
  });

  const guestRole = await prisma.role.upsert({
    where: { name: 'Guest' },
    update: {},
    create: { name: 'Guest' },
  });

  // Define permissions for each feature and action based on PermissionFeatureType enum
  const permissions = [
    {
      feature: PermissionFeatureType.UserManagement,
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      roles: { connect: [{ id: adminRole.id }] },
    },
    {
      feature: PermissionFeatureType.ProjectManagement,
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      roles: { connect: [{ id: adminRole.id }, { id: projectManagerRole.id }] },
    },
    {
      feature: PermissionFeatureType.TaskManagement,
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: false,
      roles: { connect: [{ id: teamMemberRole.id }] },
    },
    {
      feature: PermissionFeatureType.MessagesManagement,
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false,
      roles: { connect: [{ id: guestRole.id }] },
    },
  ];

  for (const permissionData of permissions) {
    const existingPermission = await prisma.permission.findFirst({
      where: {
        feature: permissionData.feature,
        canCreate: permissionData.canCreate,
        canRead: permissionData.canRead,
        canUpdate: permissionData.canUpdate,
        canDelete: permissionData.canDelete,
      },
    });

    if (!existingPermission) {
      await prisma.permission.create({
        data: permissionData,
      });
    }
  }

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'adminpassword',
      accountType: 'Local',
      isEnabled: true,
    },
  });

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      password: 'managerpassword',
      accountType: 'Local',
      isEnabled: true,
    },
  });

  const teamMemberUser = await prisma.user.upsert({
    where: { email: 'teammember@example.com' },
    update: {},
    create: {
      email: 'teammember@example.com',
      password: 'teammemberpassword',
      accountType: 'Local',
      isEnabled: true,
    },
  });

  const guestUser = await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: {
      email: 'guest@example.com',
      password: 'guestpassword',
      accountType: 'Local',
      isEnabled: true,
    },
  });

  // Assign roles to users for a specific project (assuming a project is already created)
  const project = await prisma.project.upsert({
    where: { id: 'example-project-id' },
    update: {},
    create: {
      id: 'example-project-id',
      name: 'Example Project',
    },
  });

  await prisma.projectUserRole.createMany({
    data: [
      { userId: adminUser.id, projectId: project.id, roleId: adminRole.id },
      {
        userId: managerUser.id,
        projectId: project.id,
        roleId: projectManagerRole.id,
      },
      {
        userId: teamMemberUser.id,
        projectId: project.id,
        roleId: teamMemberRole.id,
      },
      { userId: guestUser.id, projectId: project.id, roleId: guestRole.id },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
