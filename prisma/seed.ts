import { PrismaClient } from '@prisma/client';
import { createUsers } from './seed/user';
import { createActions, createRoles } from './seed/permission';
import { createProject } from './seed/project';

export const prisma = new PrismaClient();

async function main() {
  // Define the roles
  const roleRecords = await createRoles();
  await createActions(roleRecords);
  // Create users
  const { adminUser, teamMemberUser, managerUser, guestUser } =
    await createUsers();
  // Assign roles to users for a specific project (assuming a project is already created)
  await createProject(
    {
      adminRole: roleRecords['Admin'],
      projectManagerRole: roleRecords['ProjectManager'],
      teamMemberRole: roleRecords['TeamMember'],
      guestRole: roleRecords['Guest'],
    },
    { adminUser, teamMemberUser, managerUser, guestUser }
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
