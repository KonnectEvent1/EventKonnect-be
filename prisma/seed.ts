import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ---- Seed Roles ----
  const roles = ['attendee', 'vendor', 'organiser'];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }

}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
