import { Model, ModelStatic, Sequelize } from 'sequelize-typescript'
import UserScheme from './models/User'
import dotenv from 'dotenv'
import User from './models/User'
import Course, { CourseFile } from './models/Course'
import Topic from './models/Topic'
import { addTopicContraints } from './queries/topics'
import LearningMethod from './models/LearningMethod'
import Lecture, {Video} from './models/Lecture'
import IdeaContent from './models/IdeaContent'
import Quiz, {Option, Answer}from './models/Quiz'

// CONFIGURE ENVIRONMENT VARIABLES
dotenv.config()

const dbConnection = new Sequelize({
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  host: process.env.DB_HOST as string,
  dialect: 'mssql',
  dialectOptions: {
    encrypt: true,
    timeout: 60000,
  },

  port: process.env.DB_PORT as unknown as number,
  logging: process.env.NODE_ENV == 'development' ? true : false,
  models: [User, Course, Topic, CourseFile, LearningMethod, Lecture, IdeaContent, Quiz, Answer, Option,  Video],
})

export default dbConnection
