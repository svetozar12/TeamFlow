import { PermissionFeatureType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Define the roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
    },
  });

  const projectManagerRole = await prisma.role.upsert({
    where: { name: 'Project Manager' },
    update: {},
    create: {
      name: 'Project Manager',
    },
  });

  const teamMemberRole = await prisma.role.upsert({
    where: { name: 'Team Member' },
    update: {},
    create: {
      name: 'Team Member',
    },
  });

  const guestRole = await prisma.role.upsert({
    where: { name: 'Guest' },
    update: {},
    create: {
      name: 'Guest',
    },
  });

  // Define permissions for each feature and action
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
      feature: PermissionFeatureType.UserManagement,
      canCreate: false,
      canRead: true,
      canUpdate: true,
      canDelete: false,
      roles: { connect: [{ id: projectManagerRole.id }] },
    },
    {
      feature: PermissionFeatureType.ProjectCreation,
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      roles: { connect: [{ id: adminRole.id }, { id: projectManagerRole.id }] },
    },
    {
      feature: PermissionFeatureType.ProjectDeletion,
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: true,
      roles: { connect: [{ id: adminRole.id }] },
    },
    {
      feature: PermissionFeatureType.ProjectDeletion,
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false,
      roles: { connect: [{ id: projectManagerRole.id }] },
    },
    {
      feature: PermissionFeatureType.TaskManagement,
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
      feature: PermissionFeatureType.TaskManagement,
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false,
      roles: { connect: [{ id: guestRole.id }] },
    },
    {
      feature: PermissionFeatureType.AccessProjects,
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      roles: { connect: [{ id: adminRole.id }] },
    },
    {
      feature: PermissionFeatureType.AccessProjects,
      canCreate: false,
      canRead: true,
      canUpdate: true,
      canDelete: false,
      roles: { connect: [{ id: projectManagerRole.id }] },
    },
    {
      feature: PermissionFeatureType.AccessProjects,
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false,
      roles: { connect: [{ id: teamMemberRole.id }] },
    },
    {
      feature: PermissionFeatureType.AccessProjects,
      canCreate: false,
      canRead: true,
      canUpdate: false,
      canDelete: false,
      roles: { connect: [{ id: guestRole.id }] },
    },

    {
      feature: PermissionFeatureType.CommunicationChannels,
      canCreate: true,
      canRead: true,
      canUpdate: true,
      canDelete: true,
      roles: { connect: [{ id: adminRole.id }, { id: projectManagerRole.id }] },
    },
    {
      feature: PermissionFeatureType.CommunicationChannels,
      canCreate: false,
      canRead: true,
      canUpdate: true,
      canDelete: false,
      roles: { connect: [{ id: teamMemberRole.id }] },
    },
    {
      feature: PermissionFeatureType.CommunicationChannels,
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

  // Create users and assign roles
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'adminpassword',
      accountType: 'Local',
      isEnabled: true,
      roles: { connect: { id: adminRole.id } },
    },
  });

  await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      password: 'managerpassword',
      accountType: 'Local',
      isEnabled: true,
      roles: { connect: { id: projectManagerRole.id } },
    },
  });

  await prisma.user.upsert({
    where: { email: 'teammember@example.com' },
    update: {},
    create: {
      email: 'teammember@example.com',
      password: 'teammemberpassword',
      accountType: 'Local',
      isEnabled: true,
      roles: { connect: { id: teamMemberRole.id } },
    },
  });

  await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: {
      email: 'guest@example.com',
      password: 'guestpassword',
      accountType: 'Local',
      isEnabled: true,
      roles: { connect: { id: guestRole.id } },
    },
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
