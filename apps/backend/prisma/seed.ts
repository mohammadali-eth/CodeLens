import { PrismaClient, Role, UserStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@codelens.ai';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  const passwordHash = await argon2.hash('Admin@123456');

  if (!existingAdmin) {
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: passwordHash,
        name: 'Super Admin',
        role: Role.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
      },
    });
    console.log('Seeded default Super Admin account:', admin.email);
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        password: passwordHash,
        role: Role.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
      },
    });
    console.log('Updated existing Super Admin account credentials:', adminEmail);
  }
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
