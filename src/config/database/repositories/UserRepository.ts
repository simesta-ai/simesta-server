import User from '../models/User'

class UserRepository {
  model = User
  async createUser({
    name,
    email,
    password,
  }: {
    name: string
    email: string
    password: string
  }): Promise<User | null> {
    const foundUser = await this.model.findOne({ where: { email } })
    if (foundUser) return null
    const createdUser = await this.model.create({
      name,
      email,
      password,
    })
    return createdUser
  }

  loginUser = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<User | null> => {
    const foundUser = await this.model.findOne({ where: { email } })
    return foundUser
  }

  findById = async (id: string) => {
    const foundUser = await this.model.findByPk(id)
    return foundUser
  }
}

export default UserRepository
