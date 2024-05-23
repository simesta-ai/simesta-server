import express, { IRouter } from "express"
import jwt from "jsonwebtoken"
import authRoutes from "../routes/auth.routes"
import JwtService, { IJwt } from "../utils/jwtService"




class Router {
    private app: express.Application
    private jwtService: IJwt;

    constructor( app: express.Application) {
        this.app = app
        this.jwtService = new JwtService()
    }
    private isLoggedIn(req: any, res: express.Response, next: express.NextFunction) {
        req.user ? next() : res.status(401).json({message: "User is not logged in"})
    }

    public configAuthRoutes() {
        this.app.use('/auth', authRoutes)
        this.app.get('/', (req, res) => {
            res.send('<a href="/auth/google">Authenticate with Google</a>');
          });

        this.app.get('/dashboard', this.isLoggedIn,this.jwtService.grantToken, (req: any, res) => {
            const user = req.user
            res.status(200).json({ id: user._id, name: user.name})
        })
    }
    
    


}

export default Router