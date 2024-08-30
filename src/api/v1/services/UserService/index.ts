import UserRepository from '../../../../config/database/repositories/UserRepository'

const userRepository = new UserRepository()

class UserService {
  createUser = async ({
    name,
    email,
    password,
  }: {
    name: string
    email: string
    password: string
  }) => {
    const createResponse = await userRepository.createUser({
      name,
      email,
      password,
    })

    return createResponse
  }

  loginUser = ({ email, password }: { email: string; password: string }) => {
    const user = userRepository.loginUser({ email, password })
    return user
  }
}

export default UserService
