import AIGenerator from '../../../../../libs/utils/services/aigenerator'
import VideoGenerator from '../../../../../libs/utils/services/videogenerator'
import LectureRepository from '../repository'
import CourseRepository from '../../course/repository'
import {
  CustomError,
  ServerError,
} from '../../../../../libs/utils/handlers/error'
import logger from '../../../../../libs/utils/logger'
import { ICreateLecture, ILectureContent } from '../../../../../types'

const aiGenerator = new AIGenerator()
const videoGenerator = new VideoGenerator()
const lectureRepository = new LectureRepository()
const courseRepository = new CourseRepository()

const createNewLecture = async ({
  courseId,
  lectureId,
}: ICreateLecture): Promise<{
  lectureContent: ILectureContent | null
  error: null | CustomError
}> => {
  let error: CustomError | null = null
  const lectureContent: ILectureContent = {
    ideaContent: [],
    videos: [''],
  }
  try {

    const lecture = await lectureRepository.findById(lectureId)
    const course = await courseRepository.findById(courseId)


    if (lecture && course) {
      // Generate lecture Idea content
      if (course.courseFiles) {
        const generatedIdeaContent = await aiGenerator.generateIdeaContent(
          lecture.title,
          course.courseFiles
        )
        // lectureContent.ideaContent = generatedIdeaContent
      }
      const generatedIdeaContent = await aiGenerator.generateIdeaContent(
        lecture.title
      )
      // lectureContent.ideaContent = generatedIdeaContent

      // Generate video content
      const generatedVideos = await videoGenerator.generateVideos(lecture.title)
      const filteredVideos = generatedVideos.filter((videoId) => videoId)

      // Update lecture with generated videos
      await lectureRepository.updateOne({
        id: lectureId,
        updateInfo: {
          videos: filteredVideos,
        },
      })
      lectureContent.videos = filteredVideos
    } else {
      error = new ServerError('Lecture not found')
    }

  } catch (error) {
    logger.error(error)
  }
  return { lectureContent, error }
}

export default createNewLecture
