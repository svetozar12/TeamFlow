import { prisma } from '../seed';

export async function createRole() {
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

  return { adminRole, projectManagerRole, teamMemberRole, guestRole };
}
