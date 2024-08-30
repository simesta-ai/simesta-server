
import multer from "multer";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
    "image/jpeg", // jpeg
    "application/pdf", // pdf
    "image/png" // png
  ];

  if (file.size > 20 * 1024 * 1024) { 
    req.fileValidationError = 'File too large. Maximum size allowed is 20 MB.';
    return cb(null, false);
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    req.fileValidationError = 'Invalid file type. Only DOCX, JPEG, PDF, and PNG files are allowed.';
    return cb(null, false);
  }

  cb(null, true);
};

const upload = multer({ storage: storage , limits: { fileSize:  20 * 1024 * 1024}, fileFilter: fileFilter });

export default upload;