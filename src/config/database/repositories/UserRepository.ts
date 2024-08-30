import { models } from '..'

class UserRepository {
  model = models.User

  async createUser(data: any) {
    return this.model.create(data)
  }
}
