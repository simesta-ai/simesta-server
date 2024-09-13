/**
 * file: auth/service.ts
 * author: Kingsley Ihemelandu X<@kijuchihe>
 * Date: 04/09/24
 * purpose:
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
