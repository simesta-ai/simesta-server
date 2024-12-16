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

export interface ICreateLecture {
  courseId: string
  lectureId: string
  userId: string
}

export interface ILectureContent {
  ideaContent: IIdeaContent[]
  videos: string[]
}

interface QuizSection {
  question?: string
  options?: string[] | null
  explanation?: string
  correct_answer?: string
}

interface OneChoice {
  question?: string
  explanation?: string
  correct_answer?: string
}

export interface IIdeaContent {
  text: string
  imageDescription?: string
  quiz?: QuizSection
  oneChoice?: OneChoice
}

export interface ITopicLecture {
  id: string
  title: string
  position: number
}
