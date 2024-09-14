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
import { redisService } from '../../../../../libs/utils/services/redis'
import BucketManager from '../../../../../libs/utils/services/BucketManager'
import { FileService } from '../../../../../libs/utils/services/parseFile'

const bucketManager = new BucketManager()
const aiGenerator = new AIGenerator()
const videoGenerator = new VideoGenerator()
const lectureRepository = new LectureRepository()
const courseRepository = new CourseRepository()
const fileService = new FileService()

const createLectureContent = async ({
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
  let courseFileContent: string[] = []
  try {
    const lecture = await lectureRepository.findById(lectureId)
    const course = await courseRepository.findWithFiles(courseId)

    if (lecture && course) {
      //Handle course files
      const fileUrls = course.courseFiles.map((file: any) => file.url)

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

      // Generate lecture Idea content
      const generatedIdeaContent = await aiGenerator.generateIdeaContent(
        lecture.title,
        courseFileContent
      )

      if(!generatedIdeaContent || generatedIdeaContent.length === 0){
        error = new ServerError('Error generating lecture content')
        throw error
      }
      
      lectureContent.ideaContent = generatedIdeaContent

      // Generate video content
      const generatedVideos = await videoGenerator.generateVideos(lecture.title)
      const filteredVideos = generatedVideos.filter((videoId) => videoId)
      console.log(filteredVideos)
      const videoObjects = filteredVideos.map((videoId) => ({ id: videoId }))

      // Update lecture with generated videos and idea content
      await lectureRepository.updateVideoAndContent(
        lectureId,
        videoObjects,
        generatedIdeaContent
      )
      lectureContent.videos = filteredVideos
    } else {
      error = new ServerError('Lecture not found')
    }
  } catch (error) {
    logger.error(error)
  }
  return { lectureContent, error }
}

export default createLectureContent
