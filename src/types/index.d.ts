export * from './models'
export * from './requests'
export * from './generics'

// Express
import { Request, Response, NextFunction } from 'express'

export interface RequestWithUser extends Request {
  user?: Partial<User> // TODO: Come back to naming this
  fieldValidationError?: string
}

export type ControllerFunction = (
  req: RequestWithUser,
  res: Response,
  next?: NextFunction
) => Promise<void> | void

export interface IResponseBody {
  message: string
  success: boolean
  data?: any
}

export interface ProviderResponse {
  error: Error | null
  data: any
}
