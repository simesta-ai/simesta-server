import User from '../../../../config/database/models/User'
import UserRepository from '../../../../config/database/repositories/UserRepository'

const userRepository = new UserRepository()

class AuthService {
  createUser = async ({
    name,
    email,
    password,
  }: {
    name: string
    email: string
    password: string
  }): Promise<User | null> => {
    const createResponse = await userRepository.createUser({
      name,
      email,
      password,
    })

    return createResponse
  }
}
export default AuthService
