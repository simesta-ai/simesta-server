// import Course from '../../../../config/database/schemas/course.model'
// import Topic from '../../../../config/database/schemas/topic.model'
// import Lecture from '../../../../config/database/schemas/lecture.model'
// import AIGenerator from '../../../../libs/utils/services/aigenerator'
// import { CustomError, ServerError } from '../../../../libs/utils/handlers/error'
// import { string } from 'joi'
// import logger from '../../../../libs/utils/logger'

// interface ITopicLecture {
//   id: string
//   title: string
//   position: number
// }

// class GetTopicService {
//   private AIGenerator: AIGenerator

//   constructor() {
//     this.AIGenerator = new AIGenerator()
//   }
//   private async createLectures(
//     topicId: string,
//     courseTitle: string,
//     topicTitle: string,
//     courseFiles?: string
//   ) {
//     const topicLectures: Array<ITopicLecture> = []
//     let newLectures: string[] = []
//     if (courseFiles && courseFiles.length > 10) {
//       newLectures = await this.AIGenerator.generateLecturesWithFiles(
//         courseTitle,
//         topicTitle,
//         courseFiles
//       )
//     } else {
//       newLectures = await this.AIGenerator.generateLectures(
//         courseTitle,
//         topicTitle
//       )
//     }
//     for (const lecture of newLectures) {
//       const lectureNumber = newLectures.indexOf(lecture) + 1
//       const newLecture = await new Lecture({
//         title: lecture,
//         lectureText: '',
//         videos: [''],
//         position: lectureNumber,
//         topic: topicId,
//       }).save()
//       topicLectures.push({
//         id: newLecture._id,
//         title: newLecture.title,
//         position: newLecture.position,
//       })
//     }
//     return topicLectures
//   }
//   async createNewTopic(topicId: string) {
//     let error: CustomError | null = null
//     let topicTitle: string = ''
//     let topicLectures: ITopicLecture[] = []
//     try {
//       const originalTopic: any = await Topic.findById(topicId)
//       if (originalTopic) {
//         topicTitle = originalTopic.title
//         const originalCourse: any = await Course.findById(originalTopic.course)
//         const createdLectures = await this.createLectures(
//           topicId,
//           originalCourse.title,
//           originalTopic.title,
//           originalCourse.courseFiles.join(' ')
//         )

//         if (!createdLectures) {
//           error = new ServerError(
//             'Unable to create topic content, could not generate lectures'
//           )
//         } else {
//           topicLectures = createdLectures
//         }
//       } else {
//         error = new ServerError('This topic does not exist anymore')
//       }
//     } catch (error) {
//       logger.error(error)
//     }
//     return { topic: topicTitle, lectures: topicLectures, error: error }
//   }
//   async getTopic(topicId: string) {
//     let error: CustomError | null = null
//     let topicTitle: string = ''
//     let topicLectures: ITopicLecture[] = []
//     try {
//       const originalTopic = await Topic.findById(topicId)
//       if (originalTopic) {
//         topicTitle = originalTopic.title
//         const existingLectures = await Lecture.find({ topic: topicId })
//         // If the topic has lectures already return them
//         if (existingLectures.length > 0) {
//           for (const lecture of existingLectures) {
//             topicLectures.push({
//               id: lecture._id,
//               title: lecture.title,
//               position: lecture.position,
//             })
//           }

//           // if the topic does not have existing lectures, create new ones
//         } else {
//           error = new ServerError(
//             'Unable to fetch topic content, no lectures exist'
//           )
//         }
//       } else {
//         error = new ServerError('This topic does not exist')
//       }
//     } catch (error) {
//       logger.error(error)
//     }
//     return { topic: topicTitle, lectures: topicLectures, error: error }
//   }
// }

// export default GetTopicService
