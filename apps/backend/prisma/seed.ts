import { PrismaClient, Role, UserStatus, ReviewStatus, ProgrammingLanguage, Severity } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash('Admin@123456');

  // Seed Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@codelens.ai' },
    update: {
      password: passwordHash,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
    create: {
      email: 'admin@codelens.ai',
      password: passwordHash,
      name: 'Super Admin',
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log('Seeded Super Admin:', admin.email);

  // Seed Lead Developer
  const devLead = await prisma.user.upsert({
    where: { email: 'sarah.miller@codelens.ai' },
    update: {},
    create: {
      email: 'sarah.miller@codelens.ai',
      password: passwordHash,
      name: 'Sarah Miller',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  // Seed Reviewer
  const reviewer = await prisma.user.upsert({
    where: { email: 'john.doe@codelens.ai' },
    update: {},
    create: {
      email: 'john.doe@codelens.ai',
      password: passwordHash,
      name: 'John Doe',
      role: Role.MODERATOR,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('Seeded Users into PostgreSQL database.');

  // Seed Sample Code Reviews
  const existingReview = await prisma.review.findFirst({
    where: { creatorId: admin.id },
  });

  if (!existingReview) {
    await prisma.review.create({
      data: {
        title: 'Auth JWT Guards Refactoring',
        description: 'Updated JWT validation rules and added expiration checks.',
        status: ReviewStatus.COMPLETED,
        score: 92,
        summary: 'Code quality verified. Security null-guards added.',
        explanation: 'Refactored token verification logic.',
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)',
        aiProvider: 'gemini',
        aiModel: 'gemini-1.5-pro',
        processingTimeMs: 1240,
        creatorId: admin.id,
        files: {
          create: [
            {
              filename: 'jwt.service.ts',
              content: 'export class JwtService { verify(token: string) { return jwt.verify(token, secret); } }',
              language: ProgrammingLanguage.TYPESCRIPT,
              improvedCode: 'export class JwtService { public verifyToken(token: string): TokenPayload { return jwt.verify(token, secret); } }',
              issues: {
                create: [
                  {
                    line: 2,
                    severity: Severity.HIGH,
                    category: 'SECURITY',
                    message: 'Missing null check before token verification',
                    suggestion: 'Add token guard check',
                  },
                ],
              },
            },
          ],
        },
      },
    });
    console.log('Seeded sample Code Reviews into PostgreSQL database.');
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
