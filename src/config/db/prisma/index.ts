import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error', 'query', 'info', 'warn'],
})

export default prisma
