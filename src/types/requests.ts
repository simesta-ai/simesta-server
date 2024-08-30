import { Express } from 'express'

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
  subtopics: string | string[]
}
