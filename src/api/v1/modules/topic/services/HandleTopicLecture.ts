import AIGenerator from '../../../../../libs/utils/services/aigenerator'
import {
  CustomError,
  ServerError,
} from '../../../../../libs/utils/handlers/error'
import logger from '../../../../../libs/utils/logger'
import LectureRepository from '../../lecture/repository'
import TopicRepository from '../repository'
import CourseRepository from '../../course/repository'
import { redisService } from '../../../../../libs/utils/services/redis'
import BucketManager from '../../../../../libs/utils/services/BucketManager'
import { FileService } from '../../../../../libs/utils/services/parseFile'
import { ITopicLecture } from '../../../../../types'
import { populateTopicLecture } from './populateTopicLecture'

const aIGenerator = new AIGenerator()
const lectureRepository = new LectureRepository()
const topicRepository = new TopicRepository()
const courseRepository = new CourseRepository()
const bucketManager = new BucketManager()
const fileService = new FileService()

const createTopicLectures = async (topicId: string) => {
  let error: CustomError | null = null
  let topicTitle: string = ''
  let topicLectures: ITopicLecture[] = []
  let courseFileContent: string[] = []
  try {
    const originalTopic: any = await topicRepository.findById(topicId)
    if (originalTopic) {
      topicTitle = originalTopic.title
      const originalCourse: any = await courseRepository.findWithFiles(
        originalTopic.courseId
      )

      //Handle course files
      console.log('originalCourse', originalCourse)

      const fileUrls = originalCourse.courseFiles.map((file: any) => file.url)
      console.log('fileUrls', fileUrls)

      if (fileUrls.length > 0) {
        courseFileContent = await Promise.all(
          fileUrls.map(async (url: string) => {
            const IsCached = await redisService.client.get(url)
            if (IsCached) {
              return IsCached
            }
            const { downloadPath, downloadError } =
              await bucketManager.downloadFile(url)
            if (downloadError) {
              error = new ServerError('Error downloading course file')
              throw error
            }
            const { data, fileError } = await fileService.parseFile(
              downloadPath
            )
            if (fileError) {
              error = fileError
            }
            if (data) {
              await redisService.client.set(url, JSON.stringify(data))
              return data
            }
          })
        )
      }

      const createdLectures = await populateTopicLecture(
        topicId,
        originalCourse.title,
        originalTopic.title,
        courseFileContent.join(' ')
      )

      if (!createdLectures) {
        error = new ServerError(
          'Unable to create topic content, could not generate lectures'
        )
      } else {
        topicLectures = createdLectures
      }
    } else {
      error = new ServerError('This topic does not exist anymore')
    }
  } catch (error) {
    logger.error(error)
  }
  return { topic: topicTitle, lectures: topicLectures, error: error }
}

export default createTopicLectures
