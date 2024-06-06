import { Request, Response, NextFunction } from "express";
import joi from "joi";
import { ValidateError } from "../../utils/handlers/error";



class Uservalidator  {
  private emailSchema: joi.StringSchema;
  private nameSchema: joi.StringSchema;
  private passwordSchema: joi.StringSchema;
  private readonly passwordRegex =
    /^(?=(?:.*[A-Z]){2})(?=(?:.*[a-z]){3})(?=(?:.*\d){2})(?=(?:.*[!@#$%^&*()_+|~=`{}\[\]:";'<>?,./\\-]){1}).{8,}$/;

  constructor() {
    this.emailSchema = joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ng"] } }).required();
    this.nameSchema = joi.string().min(3).max(50);
    this.passwordSchema = joi.string().pattern(new RegExp(this.passwordRegex)).required();
  }

  private setupSchema(): joi.ObjectSchema {
    const validator = joi.object({
      email: this.emailSchema,
      name: this.nameSchema,
      password: this.passwordSchema,
    }).with('email', 'password');
    return validator
  }

  public async validate(req: Request, res: Response, next: NextFunction) {
    const userpayload = req.body
    try {
        const validated = await this.setupSchema().validateAsync(userpayload)
        if(validated){
          next()
        } else {
          throw new ValidateError("Unable to validate user")
        }
    } catch (error) {
        next(error)
    }
  }
}

export default Uservalidator
