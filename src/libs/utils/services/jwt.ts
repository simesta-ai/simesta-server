import jwt from 'jsonwebtoken'
import { AuthError } from '../handlers/error'
import { RequestWithUser } from '../../../types'
import { Request, Response, NextFunction } from 'express'
import { redisService } from '../services/redis'

export interface IJwt {
  grantToken(req: RequestWithUser, res: Response, next: NextFunction): void
  verifyToken(req: RequestWithUser, res: Response, next: NextFunction): void
}

class JwtService implements IJwt {
  // CHECK TOKEN BLACKLIST
  public checkBlacklist(token: string) {
    console.log(token)
    const result = redisService.get(token)
    return result
  }

  // CREATE TOKEN
  public grantToken(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const user = req.user
      if (user) {
        const token = jwt.sign({ user: user }, 'secret', { expiresIn: '24h' })
        res.header('Authorization', `Bearer ${token}`)
        next()
      } else {
        throw new AuthError(
          'Unable to authorize user by JSON token, make sure user is logged in.'
        )
      }
    } catch (error) {
      next(error)
    }
  }

  // VERIFY TOKEN
  public async verifyToken(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        throw new AuthError(
          'Unable to authorize user: User not currently logged in.'
        )
      }
      const isBlacklisted = redisService.get(token)
      if (await isBlacklisted) {
        throw new AuthError('Invalid token: User logged out')
      }
      const verified = jwt.verify(token, 'secret')
      if (verified) {
        req.user = verified
        next()
      } else {
        throw new AuthError('Invalid token: Attempt to login afresh')
      }
    } catch (error) {
      next(error)
    }
  }

  //  INVALIDATE TOKEN
  public async invalidateToken(
    req: RequestWithUser,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        throw new AuthError(
          'Unable to authorize user: User not currently logged in.'
        )
      }
      const result = await redisService.set(token, 'blacklisted')
      if (result) {
        req.user = ''
        next()
      } else {
        throw new AuthError(
          'Could not log user out: Unable to invalidate token'
        )
      }
    } catch (error) {
      next(error)
    }
  }

  // CHECK USER OBJECT IN REQUEST
  public isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        next()
      } else {
        throw new AuthError('User is not logged in')
      }
    } catch (error) {
      next(error)
    }
  }
}

export default JwtService
