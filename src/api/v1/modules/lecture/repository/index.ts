import prisma from '../../../../../config/db/prisma'

class LectureRepository {
  model = prisma.lecture

  createOne = async ({
    title,
    description,
    videoUrl,
    courseId,
    userId,
  }: {
    title: string
    description: string
    videoUrl: string
    courseId: string
    userId: string
  }): Promise<any> => {
    const lecture = await this.model.create({
      data: {
        title,
        description,
        videoUrl,
        courseId,
        userId,
      },
    })
    return lecture
  }

  findById = async (id: string) => {
    const lecture = await this.model.findUnique({ where: { id } })
    return lecture
  }

  updateOne = async ({  id, updateInfo }: { id: string, updateInfo: Record<string, string[]> }) => {
    const updated = await this.model.update({ where: { id }, data: updateInfo })
    return updated
  }
}

export default LectureRepository
