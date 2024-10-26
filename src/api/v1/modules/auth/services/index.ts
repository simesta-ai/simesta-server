/**
 * @file auth/services/index.ts
 * @author [Kingsley Ihemelandu]
 * @github [https://github.com/kijuchihe]
 * @description Defines the authentication services for the application.
 * @created [2024-07-20]
 * @lastModified [2024-07-20]
 * @module api/v1/modules/auth
 *
 * //@typedef {import('../../user/repository').IUser} IUser
 * //@typedef {import('../../user/repository').default} UserRepository
 */

import UserRepository, { IUser } from '../../user/repository'
import bcrypt from 'bcryptjs'

const userRepository = new UserRepository()

class AuthService {
  register = async ({
    name,
    email,
    password,
  }: {
    name: string
    email: string
    password: string
  }): Promise<IUser | null> => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      const createdUser = await userRepository.createOne({
        name,
        email,
        password: hashedPassword,
      })

      return createdUser
    } catch (error) {
      return null
    }
  }

  login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const user = await userRepository.findOne({ email })
      if (!user) return null
      const isCorrect = await bcrypt.compare(password, user.password)
      if (!isCorrect) return null
      return user
    } catch (error) {
      return null
    }
  }
}
export default AuthService
