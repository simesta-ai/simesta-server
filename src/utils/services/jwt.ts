import jwt from "jsonwebtoken"
import { AuthError } from "../handlers/error"

export interface IJwt {
    grantToken(req: any, res: any, next: any): void
    verifyToken(req: any, res: any, next: any): void

}

class JwtService implements IJwt {

    // CREATE TOKEN
    public grantToken(req: any, res: any, next: any){
        try {
            const user = req.user
            if(user){
                const token = jwt.sign({ user: user }, 'secret', { expiresIn: '24h' });
                res.cookie("Auth-token", token, { httpOnly: true, maxAge: 3600000 });
                next()
            } else{
                throw new AuthError("User is unauthorized")
            }
        } catch (error) {
            next(error)
        }
    }

    // VERIFY TOKEN
    public verifyToken(req: any, res: any, next: any){
        try {
            const token = req.cookies['Auth-token']
            if(!token) throw new AuthError("Access Denied")
            const verified = jwt.verify(token, 'secret')
            if(verified){
                req.user = verified
                next()
            } else {
                throw new AuthError("Invalid token")
            }
        } catch (error) {
            next(error)
        }
    }
}

export default JwtService