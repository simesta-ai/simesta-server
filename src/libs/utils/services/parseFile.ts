import { CustomError, ServerError, ValidateError } from "../handlers/error";
import path from "path";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import logger from "../logger";

export class FileService {
  async parseFile(filePath: any) {
    let fileError: CustomError | null = null;
    let data: string = "";
    try {
      const fileExtension = path.extname(filePath);

      if (fileExtension === ".pdf") {
        const result = await pdf(filePath);
        data = result.text.toString();
      } else if (fileExtension === ".docx") {
        const result = await mammoth.extractRawText({ path: filePath });
        data = result.value.toString();
      } else if ([".jpg", ".jpeg", ".png"].includes(fileExtension)) {
        const {
          data: { text },
        } = await Tesseract.recognize(filePath, "eng");
        const pictureData = text.toString();
        data = pictureData
      } else {
        fileError = new ValidateError("Invalid file format");
        throw fileError
      }
      
    } catch (error) {
      logger.error("File error: ", error)
    }
    return { data, fileError }
  }
}
