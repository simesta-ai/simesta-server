// prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create roles
  const roles = ['admin', 'user', 'moderator', 'owner', 'editor']

  for (const roleName of roles) {
    await prisma.role.create({
      data: {
        name: roleName,
      },
    })
  }

  console.log('Roles seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
