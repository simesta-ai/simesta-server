import {
  CustomError,
  ServerError,
} from '../../../../../libs/utils/handlers/error'
import logger from '../../../../../libs/utils/logger'

import LectureRepository from '../repository'

const lectureRepository = new LectureRepository()

const getLecture = async (lectureId: string) => {
  let error: CustomError | null = null
  const lectureContent: {
    videos: string[]
    ideaContent: { text: string }[]
  } = {
    ideaContent: [],
    videos: [''],
  }
  try {
    const lecture = await lectureRepository.getIdeaContents(lectureId)
    // Check if the lecture has text and video content
    if (lecture) {
      if (lecture.ideaContents.length > 0) {
        lectureContent.ideaContent = lecture.ideaContents
      } else {
        error = new ServerError('Lecture content does not exist')
      }

      if (lecture.videos && lecture.videos.length > 0) {
        lectureContent.videos = lecture.videos.map(
          (video: {
            id: string
            lectureId: string
            createdAt: Date
            updatedAt: Date
          }) => video.id
        )
      } else {
        error = new ServerError('Lecture videos do not exist')
      }
    } else {
      error = new ServerError('Lecture not found')
    }
  } catch (error) {
    logger.error(error)
  }
  return { lectureContent, error }
}

export default getLecture
