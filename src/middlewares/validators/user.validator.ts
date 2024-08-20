import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ValidateError } from "../../utils/handlers/error";
import logger from "../../utils/logger";

class Uservalidator {
  public async validate(req: Request, res: Response, next: NextFunction) {
    
    const userpayload = req.body;
    try {
      const schema = Joi.object({
        email: Joi.string()
          .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
          .required(),
        name: Joi.string().min(3).max(50),
        password: Joi.string()
          .pattern(
            new RegExp(
              /^(?=(?:.*[A-Z]){2})(?=(?:.*[a-z]){3})(?=(?:.*\d){2})(?=(?:.*[!@#$%^&*()_+|~=`{}\[\]:";'<>?,./\\-]){1}).{8,}$/
            )
          )
          .required(),
      });
      const isValid = await schema.validateAsync(userpayload);
      if (isValid) {
        next();
      } else {
        throw new ValidateError(
          "User payload does not match the required schema. Rules: valid email, Name of length more than 3 chars, password:[ min of 8 characters, at least 2 uppercase, at least 3 lowercase, at least 2 digits, at least one special char]"
        );
      }
    } catch (error) {
      next(error);
    }
  }
}

export default Uservalidator;
