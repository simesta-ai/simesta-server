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
  user: IUser
  createdAt?: Date
  updatedAt?: Date
}

export interface IUser {
  id?: string
  name: string
  email: string
  password: string
  profilePicture?: string
  appropriateLMethod?: string
  otherLMethods?: string[]
  createdAt?: Date
  updatedAt?: Date
}
