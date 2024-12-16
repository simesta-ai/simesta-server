import { IIdeaContent } from "./requests"

export interface ICourse {
  id: string
  title: string
  description: string
  completed?: boolean
  inProgress?: boolean | null
  courseType?: string | null
  difficultyLevel?: string | null
  notes?: string | null
  courseFiles?: string[]
  image?: string | null
  category: string | null
  userId: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ITopic {
  id: string;
  title: string;
  position: number;
  completed: boolean | null;
  inProgress: boolean | null;
  courseId: string;
  lectureId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  id?: string
  name: string
  email: string
  password: string
  profilePicture?: string
  appropriateLearningMethod?: string
  otherLearningMethods?: string[]
  emailVerified?: boolean
  primaryLearningMethodId: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ILecture {
  id: string
  title: string
  videos: string[]
  ideas: IIdeaContent[] //IdeaContent[]
}

export interface IQuiz {
  id: string
  question: string
  options: string[]
  answer: string[]
  explanation: string
}
