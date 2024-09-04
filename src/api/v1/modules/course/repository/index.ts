import prisma from '../../../../../config/db/prisma'

class CourseRepository {
  model = prisma.course

  createOne = async ({
    title,
    description,
    category,
    image,
    userId,
    courseFiles,
  }: {
    title: string
    description: string
    category: string
    image: string
    userId: string
    courseFiles?: any
  }): Promise<any> => {
    const course = await this.model.create({
      data: {
        title,
        description,
        category,
        img: image,
        userId,
        courseFiles: courseFiles ? courseFiles : undefined,
      },
    })
    return course
  }

  findById = async (id: string) => {
    const course = await this.model.findUnique({ where: { id } })
    return course
  }
  find = async (query?: Record<string, any>) => {
    let courses
    if (!query) {
      courses = await this.model.findMany()
    }
    courses = await this.model.findMany({ where: query })
    return courses
  }

  //   updateOne = async ({
  //     id,
  //   }: {
  //     id: string
  //     updateInfo: Record<string, any>
  //   }) => {
  //     const updated = this.model.update({}, { where: { id } })
  //   }
}

export default CourseRepository
