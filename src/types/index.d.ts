export * from './models'
export * from './requests'
export * from './generics'
declare global {
  namespace NodeJs {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production'
    }
  }
}

// Express
import { Request, Response, NextFunction } from 'express'

export interface RequestWithUser extends Request {
  user?: any // TODO: Come back to naming this
  fieldValidationError?: string
}

export type ControllerFunction = (
  req: RequestWithUser,
  res: Response,
  next?: NextFunction
) => Promise<void> | void
