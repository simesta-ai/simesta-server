import { Response, Request, NextFunction } from "express";

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
export class ClientError extends CustomError {
    statusCode: number;
    constructor(message: string) {
        super(message)
        this.name = "ClientError"
        this.message = message
        this.statusCode = 403
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

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    if(err){
        return res.status(err.statusCode || 500).json({ success: false, message: err.message })
    } else {
        return res.status(500).json({ success: false, message: "An unexpected error occured, please retry the process. There's nothing wrong."})
    }
}