import { NextFunction, Request, Response } from "express"
import { AnyZodObject } from "zod"

export function validateRequest(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        user: req.user
      })
      next()
    } catch (error) {
      next(error)
    }
  }
}