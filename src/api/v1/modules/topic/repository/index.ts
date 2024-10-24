import prisma from '../../../../../config/db/prisma'

class TopicRepository {
  model = prisma.topic

  async createOne(topicDetails: any) {
    const topic = await this.model.create({ data: { ...topicDetails } })
    return topic
  }

  async find(query: any) {
    const topic = await this.model.findMany({ where: query })
    return topic
  }

  async findAll() {
    const topics = await this.model.findMany()
    return topics
  }

  async findOne(query: any) {
    const topic = await this.model.findUnique({ where: query })
    return topic
  }

  async findById(id: string) {
    const topic = await this.model.findUnique({ where: { id } })
    return topic
  }

  async update() { }

  async updateOne() { }

  async updateAll() { }

  async deleteOne(id: string) {
    const affectedCount = await this.model.delete({ where: { id } })
    return affectedCount
  }

  async deleteAll() {
    const affectedCount = await this.model.deleteMany()
    return affectedCount
  }
}

export default TopicRepository
