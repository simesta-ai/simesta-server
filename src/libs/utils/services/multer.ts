import multer from 'multer'
import fs from 'fs'
import path from 'path'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join('', 'public/uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'image/jpeg', // jpeg
    'application/pdf', // pdf
    'image/png', // png
  ]

  if (file.size > 20 * 1024 * 1024) {
    req.fileValidationError = 'File too large. Maximum size allowed is 20 MB.'
    return cb(null, false)
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    req.fileValidationError =
      'Invalid file type. Only DOCX, JPEG, PDF, and PNG files are allowed.'
    return cb(null, false)
  }

  cb(null, true)
}

const audioFileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'audio/mpeg', // mp3
    'audio/wav', // wav
    'audio/mp4', // mp4
  ]

  if (file.size > 20 * 1024 * 1024) {
    req.fileValidationError = 'File too large. Maximum size allowed is 20 MB.'
    return cb(null, false)
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    req.fileValidationError =
      'Invalid file type. Only MP3, WAV, and MP4 files are allowed.'
    return cb(null, false)
  }

  cb(null, true)
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: fileFilter,
})
export const uploadAudio = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: audioFileFilter,
})

export default upload
