import ffmpeg from 'fluent-ffmpeg'
import { ServerError } from '../handlers/error'



function convertFileFormat(file: string, destination: string) {
  ffmpeg(file)
    .on('error', (err) => {
        throw new ServerError(err.message)
    })
    .save(destination)
    
}

export default convertFileFormat

