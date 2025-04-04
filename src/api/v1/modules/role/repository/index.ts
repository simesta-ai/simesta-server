import prisma from '../../../../../config/db/prisma'

class RoleRepository {
  model = prisma.role

  createOne = () => {}

  findOne = async (q: any) => {
    const found = await this.model.findUnique({ where: q })
    return found
  }
}

export default RoleRepository
