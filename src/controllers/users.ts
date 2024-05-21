import { Request, Response } from "express";
import { Document } from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.ts";
import IUser from "../classes/user.ts"
import Course from "../models/Course.ts"
import Topic from "../models/Topic.ts";
import LectureModel from "../models/Lecture.ts";
import generators from "../generators/generate.ts";
import { createLecture } from "../utilities.ts";
import ITopic from "../classes/topics.ts";







// User 
class UserController {


    public async addCourse(req: Request, res: Response){
      try {
        const { email } = req.params;

        // New Course
        const courseTitle = "Data Analysis"
        const courseDescription = await generators.generateCourseDescription(courseTitle)
        const courseCategory = await generators.generateCoursecategory(courseTitle)
        const courseTopics = await generators.generateTopics(courseTitle)
        const user = await User.findOne({ email: email})
        const newCourse = new Course({
          title: courseTitle,
          description: courseDescription,
          category: courseCategory,
          difficultyLevel: "Beginner",
          user: user!._id,
        })

        // New Topic
        const createdTopics: Document[] = []
        await newCourse.save().then( async (course) => {
          const courseId = course._id;
          for(const topic of courseTopics) {
            const topicPosition = courseTopics.indexOf(topic) + 1
                const newTopic = await new Topic({
                  title: topic,
                  position: topicPosition,
                  course: courseId
                }).save()
                createdTopics.push(newTopic)
          }})
          // New Lecture
          const createdLectures: string[] = []
          for(const createdTopic of createdTopics ) {
            const topicId = createdTopic._id;
            const lectureTitles = await generators.generateLectures(courseTitle, courseTopics[createdTopics.indexOf(createdTopic)])
            for(const lectureTitle of lectureTitles) {
              const lectureNumber = lectureTitles.indexOf(lectureTitle) + 1
              const newLecture = await new LectureModel({
                title: lectureTitle,
                lectureText: "",
                videos: [""],
                position: lectureNumber,
                topic: topicId
              }).save()
              createdLectures.push(newLecture._id)
            }
          }

          res.status(200).json("CourseCreated")
      
        
    } catch (error) {
      res.status(500).json("Couldnt create Course")
    }
  }
}


export default UserController
