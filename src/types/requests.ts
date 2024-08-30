export interface ICreateUserArg {
  name: string
  email: string
  password: string
}

export interface ICreateCourse {
  userId: string
  title: string
  files: any[]
  subtopics: string | string[]
}


export interface ICourseList {
  id: string
  title: string
  image: string
  progress: number
  topicsCompleted: string
}