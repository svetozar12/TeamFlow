import { prisma } from '../seed';

export async function createUsers() {
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

  return { adminUser, managerUser, teamMemberUser, guestUser };
}
