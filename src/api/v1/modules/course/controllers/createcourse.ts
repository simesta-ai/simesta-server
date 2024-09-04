// import User from '../../../../config/database/schemas/user.model'
// import Course from '../../../../config/database/schemas/course.model'
// import Topic from '../../../../config/database/schemas/topic.model'
// import AIGenerator from '../../../../libs/utils/services/aigenerator'
// import {
//   AuthError,
//   ClientError,
//   CustomError,
// } from '../../../../libs/utils/handlers/error'
// import { FileService } from '../../../../libs/utils/services/parseFile'
// import fs from 'fs'

// class CourseCreationService {
//   private AIGenerator: AIGenerator
//   private FileService: FileService

//   constructor() {
//     this.AIGenerator = new AIGenerator()
//     this.FileService = new FileService()
//   }
//   private async createCourseStructure(courseTitle: string, userId: string) {
//     let courseError: CustomError | null = null
//     let newCourse = null
//     const user = await User.findById(userId)
//     if (!user) {
//       courseError = new AuthError('User does not exist, cannot create course')
//     } else {
//       const courseDescription =
//         await this.AIGenerator.generateCourseDescription(courseTitle)
//       const courseCategory = await this.AIGenerator.generateCoursecategory(
//         courseTitle
//       )
//       const courseImage = await this.AIGenerator.generateCourseImage(
//         courseTitle
//       )
//       newCourse = new Course({
//         title: courseTitle,
//         description: courseDescription,
//         category: courseCategory,
//         image: courseImage,
//         user: user!._id,
//       })
//       await newCourse.save()
//     }
//     return { newCourse, courseError }
//   }
//   private async createTopics(
//     courseId: string,
//     courseTitle: string,
//     files?: any,
//     subtopics?: string
//   ) {
//     if (files && subtopics) {
//       const newTopics = await this.AIGenerator.generateTopics(
//         courseTitle,
//         files,
//         subtopics
//       )
//       for (const topic of newTopics) {
//         const topicPosition = newTopics.indexOf(topic) + 1
//         await new Topic({
//           title: topic,
//           position: topicPosition,
//           course: courseId,
//           inProgress: topicPosition === 1 ? true : false,
//         }).save()
//       }
//     } else if (files && !subtopics) {
//       const newTopics = await this.AIGenerator.generateTopics(
//         courseTitle,
//         files
//       )
//       for (const topic of newTopics) {
//         const topicPosition = newTopics.indexOf(topic) + 1
//         await new Topic({
//           title: topic,
//           position: topicPosition,
//           course: courseId,
//           inProgress: topicPosition === 1 ? true : false,
//         }).save()
//       }
//     } else if (!files && subtopics) {
//       const newTopics = await this.AIGenerator.generateTopics(
//         courseTitle,
//         undefined,
//         subtopics
//       )
//       for (const topic of newTopics) {
//         const topicPosition = newTopics.indexOf(topic) + 1
//         await new Topic({
//           title: topic,
//           position: topicPosition,
//           course: courseId,
//           inProgress: topicPosition === 1 ? true : false,
//         }).save()
//       }
//     } else {
//       const newTopics = await this.AIGenerator.generateTopics(courseTitle)
//       for (const topic of newTopics) {
//         const topicPosition = newTopics.indexOf(topic) + 1
//         await new Topic({
//           title: topic,
//           position: topicPosition,
//           course: courseId,
//           inProgress: topicPosition === 1 ? true : false,
//         }).save()
//       }
//     }
//   }
//   async createCourse(
//     userId: string,
//     title: string,
//     files?: any,
//     subtopics?: string
//   ) {
//     let error: CustomError | null = null
//     let courseId: string = ''

//     const isValidCourseTitle = await this.AIGenerator.confirmCourseTitle(title)
//     if (!isValidCourseTitle) {
//       error = new ClientError(
//         'Invalid course title, please enter a valid title.'
//       )
//     } else {
//       const { newCourse, courseError } = await this.createCourseStructure(
//         title,
//         userId
//       )
//       if (courseError) {
//         error = courseError
//       } else if (newCourse) {
//         courseId = newCourse._id
//         const parseFiles = async (files: any) => {
//           // Add files to course and generate course topics
//           const filePaths = files.map((file: any) => file.path)
//           const fileData = await Promise.all(
//             filePaths.map(async (filePath: string) => {
//               const { data, fileError } = await this.FileService.parseFile(
//                 filePath
//               )
//               if (fileError) {
//                 error = fileError
//               }
//               return data
//             })
//           )

//           filePaths.forEach((filePath: string) => {
//             fs.unlinkSync(filePath)
//           })
//           return fileData
//         }
//         if (files && !subtopics) {
//           const processedFiles = await parseFiles(files)
//           // Add files to course
//           await Course.updateOne(
//             { _id: newCourse._id },
//             { $set: { courseFiles: processedFiles } }
//           )
//           await newCourse.save()
//           await this.createTopics(
//             newCourse._id,
//             newCourse.title,
//             newCourse.courseFiles.join(' ')
//           )
//         } else if (files && subtopics) {
//           // Add files to course and include the subtpics in implementation
//           const processedFiles = await parseFiles(files)
//           // Add files to course
//           await Course.updateOne(
//             { _id: newCourse._id },
//             { $set: { courseFiles: processedFiles } }
//           )
//           await newCourse.save()
//           await this.createTopics(
//             newCourse._id,
//             newCourse.title,
//             newCourse.courseFiles.join(' '),
//             subtopics
//           )
//         } else if (!files && subtopics) {
//           // Implement topics creation from just subtopics provided
//           await this.createTopics(
//             newCourse._id,
//             newCourse.title,
//             undefined,
//             subtopics
//           )
//         } else {
//           // Auto-generate topics
//           await this.createTopics(newCourse._id, newCourse.title)
//         }
//       }
//     }
//     return { courseId, error }
//   }
// }

// export default CourseCreationService
