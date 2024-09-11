import { CustomError } from '../../../../../libs/utils/handlers/error'
import {  ICreateLecture, ILectureContent } from '../../../../../types'
import createLecture from './createLecture'


class LectureService {
  create: ({ courseId, lectureId}: ICreateLecture) => Promise<{
    lectureContent: ILectureContent | null
    error: null | CustomError
  }> = createLecture

}

export default LectureService
