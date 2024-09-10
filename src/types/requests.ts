export interface ICreateUserArg {
  name: string
  email: string
  password: string
}

export interface ICreateCourse {
  userId: string
  title: string
  files:
    | File[]
    | { [fieldname: string]: File[] }
    | undefined
    | Express.Multer.File[]
    | any
  subtopics: string
}
