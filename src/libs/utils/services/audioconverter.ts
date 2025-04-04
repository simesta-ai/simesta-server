const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)
import { ServerError } from '../handlers/error'

function convertFileFormat(file: string, destination: string) {
  ffmpeg(file)
    .on('error', (err: any) => {
      throw new ServerError(err.message)
    })
    .save(destination)
}

export default convertFileFormat
