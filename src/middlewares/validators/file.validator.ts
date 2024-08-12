import { Request, Response, NextFunction } from "express";
import { ValidateError } from "../../utils/handlers/error";
interface CustomRequest extends Request {
  fileValidationError?: string;
}

const checkTotalFileSize = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.files) {
    return next();
  }

  if (req.fileValidationError) {
    throw new ValidateError(req.fileValidationError);
  }
  let totalSize = 0;
  if (Array.isArray(req.files)) {
    req.files?.forEach((file: Express.Multer.File) => {
      totalSize += file.size;
    });
  }

  if (totalSize > 500 * 1024 * 1024) {
    throw new ValidateError("Total file size exceeds 500 MB");
  }

  next();
};

export default checkTotalFileSize;