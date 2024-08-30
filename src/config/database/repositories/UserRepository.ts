import User from '../models/User'

class UserRepository {
  model = User
  async createUser({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) {
    const foundUser = await this.model.findOne({ where: { email } })
    if (foundUser) return null
    const createdUser = await this.model.create({
      firstName,
      lastName,
      email,
      password,
    })
    return createdUser
  }
}
