import { CustomError } from '../../../../../libs/utils/handlers/error'
import {  ICreateLecture, ILectureContent } from '../../../../../types'
import createLectureContent from './createLectureContent'
import getLecture from './getLecture'


class LectureService {
  //new method
  create: ({ courseId, lectureId, userId}: ICreateLecture) => Promise<{
    lectureContent: ILectureContent | null
    error: null | CustomError
  }> = createLectureContent

  get: (lectureId: string) => Promise<{
    lectureContent: ILectureContent
    error: CustomError | null
  }> = getLecture

}

export default LectureService
