import CourseModel from '../../models/course.model';
import { AuthError, ClientError, CustomError } from '../../utils/handlers/error';
import AIGenerator from '../../utils/services/aigenerator';
import { FileService } from '../../utils/services/parseFile';
import fs from 'fs'
import TopicService from '../TopicService';
import UserModel from '../../models/user.model';

const AIGen = new AIGenerator()
const fileService = new FileService()
const topicService = new TopicService()

const createCourse = async (userId: string, title: string, files: any, subtopics: string[]|string):Promise<{courseId: string|null, error: any}> => {

    let error: CustomError | null = null;
    let courseId: string = "";

    try {

    } catch (error) {

    }

    const isValidCourseTitle = await AIGen.confirmCourseTitle(title);
    if (!isValidCourseTitle) return {courseId: null, error: new ClientError("Invalid course title, please enter a valid title.")};

    const {newCourse, courseError} = await createCourseStructure(title, userId);
      if(courseError) return {courseId: null, error: courseError}
      courseId = newCourse!._id
        if (files && !subtopics) {
          // Add files to course and generate course topics
          const filePaths = files.map((file: any) => file.path);
          const fileData = await Promise.all(
            filePaths.map(async (filePath: string) => {
              const {data, fileError} = await fileService.parseFile(filePath);
              if(fileError){
                error = fileError
              }
              return data;
            })
          );

          filePaths.forEach((filePath: string) => {
            fs.unlinkSync(filePath);
          });

          // Add files to course
          await CourseModel.updateOne(
            { _id: newCourse!._id },
            { $set: { courseFiles: fileData } }
          );
          await newCourse!.save()
          await topicService.createTopics(newCourse!._id, newCourse!.title, newCourse!.courseFiles.join(" "))

        } else if (files && subtopics) {
          // Add files to course and include the subtpics in implementation
        } else if (!files && subtopics) {
          // Implement topics creation from just subtopics provided
        } else {
          // Auto-generate topics
          await topicService.createTopics(newCourse!._id, newCourse!.title)
        }

    return { courseId, error }

}

const  createCourseStructure = async (courseTitle: string, userId: string) => {
    let courseError: CustomError | null = null;
    let newCourse = null
    const user = await UserModel.findById(userId);
    if (!user) {
      courseError = new AuthError("User does not exist, cannot create course");
    } else {
      const courseDescription = await AIGen.generateCourseDescription(
        courseTitle
      );
      const courseCategory = await AIGen.generateCoursecategory(
        courseTitle
      );
      const courseImage = await AIGen.generateCourseImage(courseTitle);
      newCourse = new CourseModel({
        title: courseTitle,
        description: courseDescription,
        category: courseCategory,
        image: courseImage,
        user: user!._id,
      });
      await newCourse.save();
    }
    return {newCourse, courseError}
  }

export default createCourse
