/**
 * @file user/repository/index.ts
 * @author [Kingsley Ihemelandu]
 * @github [https://github.com/kijuchihe]
 * @description Defines the user repository for the application.
 * @created [2024-07-20]
 * @lastModified [2024-07-20]
 * @module api/v1/modules/user
 */

import prisma from '../../../../../config/db/prisma'
import RoleRepository from '../../role/repository'
import { IUser } from '../../../../../types'

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
      const newUser = await prisma.$transaction(async (prisma:any) => {
        const foundUser = await prisma.user.findUnique({ where: { email } })
        if (foundUser)
          throw new Error(`User with email ${email} already exists`)
        const baseRole = await roleRepository.findOne({ name: 'user' })

        return prisma.user.create({
          data: {
            email,
            name,
            password,
            roleId: baseRole ? baseRole.id : null,
            // other user fields...
          },
        })
      })
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

  updateEmailVerified = async(email: string) => {
    try {
      const updatedUser = await this.model.update({
        where: { email },
        data: { emailVerified: true },
      });
      return updatedUser;
    } catch (error) {
      return null;
    }
  }
}

export default UserRepository
