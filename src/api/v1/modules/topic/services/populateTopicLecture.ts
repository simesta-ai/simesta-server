import { ITopicLecture } from '../../../../../types'
import LectureRepository from '../../lecture/repository'
import AIGenerator from '../../../../../libs/utils/services/aigenerator'


const lectureRepository = new LectureRepository()
const aIGenerator = new AIGenerator()


export const populateTopicLecture = async(
    topicId: string,
    courseTitle: string,
    topicTitle: string,
    courseFiles?: string
  ) =>{
    const topicLectures: Array<ITopicLecture> = []
    let newLectures: string[] = []

    newLectures = await aIGenerator.generateLectures(
      courseTitle,
      topicTitle,
      courseFiles
    )

    for (const lecture of newLectures) {
      const lectureNumber = newLectures.indexOf(lecture) + 1
      const newLecture = await lectureRepository.createOne({
        title: lecture,
        ideaContents: {create:[]},
        videos: {create:[]},
        position: lectureNumber,
        topicId: topicId,
      })
      topicLectures.push({
        id: newLecture._id,
        title: newLecture.title,
        position: newLecture.position,
      })
    }
    return topicLectures
  }