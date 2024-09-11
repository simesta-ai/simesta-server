import prisma from '../../../../../config/db/prisma'
import RoleRepository from '../../role/repository'

export interface IUser {
  id: string
  email: string
  password: string
  name: string
  roleId: string | null
  createdAt: Date
  updatedAt: Date
  age: number | null
  avatar: string
  primaryLearningMethodId: string | null
}

const roleRepository = new RoleRepository()
class UserRepository {
  private model = prisma.user

  createOne = async ({
    email,
    name,
    password,
  }: {
    email: string
    name: string
    password: string
  }): Promise<IUser | null> => {
    try {
      const newUser = await prisma.$transaction(async (prisma) => {
        const foundUser = await prisma.user.findUnique({ where: { email } })
        if (foundUser)
          throw new Error(`User with email ${email} already exists`)
        const baseRole = await roleRepository.findOne({ name: 'user' })

        return await prisma.user.create({
          data: {
            email,
            name,
            password,
            roleId: baseRole ? baseRole.id : null,
            // other user fields...
          },
        })
      }, { timeout: 30000 })
      return newUser
    } catch (error: any) {
      if (error.code === 'P2002') {
        // Prisma unique constraint violation error code
        console.error(`User with email ${email} already exists.`)
        return null // or handle as needed
      }
      console.error(error)
      throw error // Rethrow other errors
    }
  }

  findOne = async (q: any) => {
    const foundUser = await this.model.findUnique({ where: q })
    return foundUser
  }

  findById = async (id: string) => {
    const foundUser = await this.model.findUnique({ where: { id } })
    return foundUser
  }
}

export default UserRepository
