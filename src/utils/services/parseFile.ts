import { ServerError, ValidateError } from "../handlers/error";
import path from "path";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";

export class FileService {
  async parseFile(filePath: any) {
    try {
      const fileExtension = path.extname(filePath);

      if (fileExtension === ".pdf") {
        const data = await pdf(filePath);
        return data.text.toString();
      }
      if (fileExtension === ".docx") {
        const data = await mammoth.extractRawText({ path: filePath });
        return data.value.toString();
      }
      if ([".jpg", ".jpeg", ".png"].includes(fileExtension)) {
        const {
          data: { text },
        } = await Tesseract.recognize(filePath, "eng");
        return text.toString();
      }
      throw new ValidateError("Invalid file format");
    } catch (error) {
      throw new ServerError("Unable to parse file");
    }
  }
}
