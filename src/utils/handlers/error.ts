import { Response, Request, ErrorRequestHandler, NextFunction } from "express";

export abstract class CustomError extends Error {
    statusCode: number;
    constructor(message: string) {
        super(message)
        this.statusCode = 200
    }
}

export class ServerError extends CustomError {
    statusCode: number;
    constructor(message: string) {
        super(message)
        this.name = "ServerError"
        this.message = message
        this.statusCode = 500
    }
}

export class AuthError extends CustomError {
    statusCode: number;
    constructor(message: string) {
        super(message)
        this.name = "AuthError"
        this.message = message
        this.statusCode = 401
    }
}

export class ValidateError extends CustomError {
    statusCode: number;
    constructor(message: string) {
        super(message)
        this.name = "ValidateError"
        this.message = message
        this.statusCode = 406
    }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if(err){
        res.status(500).json("error")
    }
    // return res.status(err.statusCode).json({ message: err.message })
}