import LearningMethod from '../config/database/models/LearningMethod'
import IdeaContent from '../config/database/models/IdeaContent'

export interface ICourse {
  id?: string
  title: string
  description: string
  completed?: boolean
  inProgress?: boolean
  courseType?: string
  difficultyLevel?: string
  notes?: string
  courseFiles?: string[]
  image?: string
  category: string
  user: string | IUser
  createdAt?: Date
  updatedAt?: Date
}

export interface IUser {
  id?: string
  name: string
  email: string
  password: string
  profilePicture?: string
  appropriateLearningMethod?: string
  otherLearningMethods?: LearningMethod[]
  createdAt?: Date
  updatedAt?: Date
}


export interface ILecture {
    id: string;
    title: string;
    videos: string[];
    ideas: IdeaContent[];
  }

 export interface IQuiz {
    id: string;
    question: string;
    options: string[];
    answer: string[];
    explanation: string;
  }
  