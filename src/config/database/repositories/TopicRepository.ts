import { Repository } from '../../../types'
import Topic from '../models/Topic'
class TopicRepository {
  model = Topic

  async createTopic(topicDetails: Partial<Topic> | any): Promise<Topic> {
    const topic = await this.model.create({ ...topicDetails })
    return topic
  }

  async findAll(): Promise<Topic[]> {
    const topics = await this.model.findAll()
    return topics
  }

  async findOne(query: any): Promise<Topic | null> {
    const topic = await this.model.findOne({ where: query })
    return topic
  }

  async findById(id: number): Promise<Topic | null> {
    const topic = await this.model.findByPk(id)
    return topic
  }

  async update(topicDetails: Partial<Topic>, query: any): Promise<number> {
    const [affectedCount] = await this.model.update(topicDetails, {
      where: query,
    })
    return affectedCount
  }

  async updateOne(topicDetails: Partial<Topic>, id: number): Promise<number> {
    const [affectedCount] = await this.model.update(topicDetails, {
      where: { id },
    })
    return affectedCount
  }

  async updateAll(topicDetails: Partial<Topic>): Promise<number> {
    const [affectedCount] = await this.model.update(topicDetails, { where: {} })
    return affectedCount
  }

  async delete(id: number): Promise<number> {
    const affectedCount = await this.model.destroy({ where: { id } })
    return affectedCount
  }

  async deleteOne(query: any): Promise<number> {
    const affectedCount = await this.model.destroy({ where: query })
    return affectedCount
  }

  async deleteAll(): Promise<number> {
    const affectedCount = await this.model.destroy({ where: {} })
    return affectedCount
  }
}

export default TopicRepository
