import jwt from "jsonwebtoken"
import { AuthError } from "../handlers/error"
import { RequestWithUser } from "../../types"
import { Request, Response, NextFunction } from "express"

export interface IJwt {
    grantToken(req: RequestWithUser, res: Response, next: NextFunction): void
    verifyToken(req: RequestWithUser, res: Response, next: NextFunction): void

}

class JwtService implements IJwt {

    // CREATE TOKEN
    public grantToken(req: RequestWithUser, res: Response, next: NextFunction){
        try {
            const user = req.user
            if(user){
                const token = jwt.sign({ user: user }, 'secret', { expiresIn: '24h' });
                res.cookie("Auth-token", token, { httpOnly: true, maxAge: 3600000 });
                next()
            } else{
                throw new AuthError("Unable to authorize user by JSON token, make sure user is logged in.")
            }
        } catch (error) {
            next(error)
        }
    }

    // VERIFY TOKEN
    public verifyToken(req: Request, res: Response, next: NextFunction){
        try {
            const token = req.cookies['Auth-token']
            if(!token) {
                throw new AuthError("Unable to authorize user: User not currently logged in.")
            } 
            const verified = jwt.verify(token, 'secret')
            if(verified){
                req.user = verified
                next()
            } else {
                throw new AuthError("Invalid token: Attempt to login afresh")
            }
        } catch (error) {
            next(error)
        }
    }
}

export default JwtService