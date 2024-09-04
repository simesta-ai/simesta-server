import prisma from '../../../../../config/db/prisma'

export interface IUser {
  id: string
  email: string
  password: string
  name: string
  role: string | null
  createdAt: Date
  updatedAt: Date
  age: number | null
  avatar: string
  primaryLearningMethodId: string | null
}
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
      const foundUser = await this.model.findUnique({ where: { email } })
      if (foundUser) return null
      const newUser = await this.model.create({
        data: {
          email,
          name,
          password,
        },
      })
      return newUser
    } catch (error) {
      return null
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
