import { prisma } from '../seed';
import { User } from '@prisma/client';

export async function createProject(
  {
    adminRole,
    projectManagerRole,
    teamMemberRole,
    guestRole,
  }: {
    adminRole: { name: string; id: number };
    projectManagerRole: { name: string; id: number };
    teamMemberRole: { name: string; id: number };
    guestRole: { name: string; id: number };
  },
  {
    adminUser,
    teamMemberUser,
    managerUser,
    guestUser,
  }: {
    adminUser: User;
    teamMemberUser: User;
    managerUser: User;
    guestUser: User;
  }
) {
  const project = await prisma.project.upsert({
    where: { id: 'example-project-id' },
    update: {},
    create: {
      id: 'example-project-id',
      name: 'Example Project',
      owner: { connect: { id: adminUser.id } },
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
