import express, { IRouter } from "express"
import authRoutes from "../routes/auth.routes"




class Router {
    private app: express.Application

    constructor( app: express.Application) {
        this.app = app
    }
    private isLoggedIn(req: express.Request, res: express.Response, next: express.NextFunction) {
        req.user ? next() : res.sendStatus(401);
    }

    public configAuthRoutes() {
        this.app.use('/api/auth', authRoutes)
        this.app.get('/', (req, res) => {
            res.send('<a href="/api/auth/google">Authenticate with Google</a>');
          });
        this.app.get('/protected', this.isLoggedIn, (req, res) => {
            const name = req.user;
            res.send(name)
        })
    }
    
    


}

export default Router