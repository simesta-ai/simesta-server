import jwt from "jsonwebtoken"

export interface IJwt {
    grantToken(req: any, res: any, next: any): void
    verifyToken(req: any, res: any, next: any): void

}

class JwtService implements IJwt {

    // CREATE TOKEN
    public grantToken(req: any, res: any, next: any){
        const user = req.user
        if(user){
            const token = jwt.sign({ user: user }, 'secret', { expiresIn: '24h' });
            res.cookie("Auth-token", token, { httpOnly: true, maxAge: 3600000 });
            next()
        } else{
            res.status(401).json("User is unauthorized")
        } 
    }

    // VERIFY TOKEN
    public verifyToken(req: any, res: any, next: any){
        const token = req.cookies['Auth-token']
        if(!token) return res.status(401).json("Access denied")
        try {
            const verified = jwt.verify(token, 'secret')
            req.user = verified
            next()
        } catch (error) {
            res.status(400).json("Invalid token")
        }
    }
}

export default JwtService