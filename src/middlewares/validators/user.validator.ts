import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ValidateError } from "../../utils/handlers/error";



class Uservalidator  {

  public async validate(req: Request, res: Response, next: NextFunction) {
    const userpayload = req.body
    try {
      const schema = Joi.object({
        email: Joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required(),
        name: Joi.string().min(3).max(50),
        password: Joi.string().pattern(new RegExp(/^(?=(?:.*[A-Z]){2})(?=(?:.*[a-z]){3})(?=(?:.*\d){2})(?=(?:.*[!@#$%^&*()_+|~=`{}\[\]:";'<>?,./\\-]){1}).{8,}$/)).required(),
      });
        await schema.validateAsync(userpayload)
        
        next()
    } catch (error) {
        next(error)
    }
  }
}

export default Uservalidator
