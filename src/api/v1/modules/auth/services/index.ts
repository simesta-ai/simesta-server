/**
 * @file auth/services/index.ts
 * @author [Kingsley Ihemelandu]
 * @github [https://github.com/kijuchihe]
 * @description Defines the authentication services for the application.
 * @created [2024-07-20]
 * @lastModified [2024-07-20]
 * @module api/v1/modules/auth
 *
 * //@typedef {import('../../user/repository').IUser} IUser
 * //@typedef {import('../../user/repository').default} UserRepository
 */

import UserRepository from '../../user/repository'
import { redisService } from '../../../../../libs/utils/services/redis'
import bcrypt from 'bcryptjs'
import {
  ClientError,
  ServerError,
} from '../../../../../libs/utils/handlers/error'
import { ProviderResponse } from '../../../../../types'
import EmailService from '../../email/services'
import EmailRepository from '../../email/repository'
import validate from 'deep-email-validator'
import otpMail from './otpMail'
import logger from '../../../../../libs/utils/logger'

const userRepository = new UserRepository()
const emailService = new EmailService()
const verificationRepository = new EmailRepository()

class AuthService {
  register = async ({
    name,
    email,
    password,
  }: {
    name: string
    email: string
    password: string
  }): Promise<ProviderResponse> => {
    try {
      let error = null
      let data = null

      const cachedUser = await redisService.hgetall(`user:${email}`)

      if (cachedUser && Object.keys(cachedUser).length > 0) {
        error = new ClientError('User already exists')
        return { error, data: null }
      }

      const existingUser = await userRepository.findByEmail(email)
      if (existingUser) {
        error = new ClientError('User already exists')
      } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        const createdUser = await userRepository.createOne({
          name,
          email,
          password: hashedPassword,
        })
        if (!createdUser) {
          error = new ClientError('User could not be created')
        } else {
          setImmediate(async () => {
            try {
              await redisService.hset(`user:${email}`, createdUser)
              await redisService.hset(`user:${createdUser.id}`, createdUser)
              logger.info(`User with email: ${email} cached successfully`)
            } catch (error) {
              logger.error('Failed to cache user:', error)
            }
          })
          data = {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            emailVerified: createdUser.emailVerified,
          }
          setImmediate(async () => {
            try {
              await this.sendVerificationEmail(createdUser.email)
            } catch (emailError) {
              logger.error('Failed to send verification email:', emailError)
            }
          })
        }
      }
      return { data, error }
    } catch (error: any) {
      return { error, data: null }
    }
  }

  login = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<ProviderResponse> => {
    try {
      let error = null
      let data = null

      const cachedUser = await redisService.hgetall(`user:${email}`)
      if (cachedUser && Object.keys(cachedUser).length > 0) {
        const isCorrect = await bcrypt.compare(password, cachedUser.password)
        if (!isCorrect) {
          error = new ClientError('Incorrect credentials')
        } else {
          data = {
            id: cachedUser.id,
            name: cachedUser.name,
            email: cachedUser.email,
            emailVerified: cachedUser.emailVerified,
          }
        }
      } else {
        const existingUser = await userRepository.findByEmail(email)
        if (!existingUser) {
          error = new ClientError('User does not exist')
        } else {
          const isCorrect = await bcrypt.compare(
            password,
            existingUser.password
          )
          if (!isCorrect) {
            error = new ClientError('Incorrect credentials')
          } else {
            setImmediate(async () => {
              try {
                await redisService.hset(`user:${email}`, existingUser)
                await redisService.hset(`user:${existingUser.id}`, existingUser)
                logger.info(`User with email: ${email} cached successfully`)
              } catch (error) {
                logger.error('Failed to cache user:', error)
              }
            })
            data = {
              id: existingUser.id,
              name: existingUser.name,
              email: existingUser.email,
              emailVerified: existingUser.emailVerified,
            }
          }
        }
      }
      return { error, data }
    } catch (error: any) {
      return { error, data: null }
    }
  }

  async sendVerificationEmail(email: string) {
    let error = null
    let data = null
    try {
      const isEmailValid = await validate({ email, validateRegex: true })
      if (!isEmailValid) {
        error = new ClientError('Invalid email address')
        return { error, data: null }
      }
      const existingUser = await userRepository.findByEmail(email)
      if (!existingUser) {
        error = new ClientError('User does not exist')
        return { error, data: null }
      }
      const otp = Math.floor(1000 + Math.random() * 9000)
      const hashedOtp = await bcrypt.hash(otp.toString(), 10)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
      console.log(new Date(Date.now()), expiresAt)
      const newOtp = await verificationRepository.createVerificationCode(
        hashedOtp,
        email,
        expiresAt
      )
      if (!newOtp) {
        error = new ClientError('Verification code could not be created')
        return { error, data: null }
      }
      const html = otpMail(existingUser.name, otp)
      const sentResult = await emailService.sendMail(
        email,
        'Confirm your Simesta Email',
        undefined,
        html
      )
      if (!sentResult) {
        error = new ClientError('Could not send verification email')
        return { error, data: null }
      }
      data = sentResult
      return { error, data }
    } catch (error: any) {
      return { error, data: null }
    }
  }
  async verifyOtp(email: string, otp: string) {
    let error = null
    let data = null
    try {
      const foundOtp = await verificationRepository.getVerificationCode(email)
      if (!foundOtp) {
        error = new ClientError('Invalid verification code')
      } else {
        const otpIsCorrect = bcrypt.compare(otp.toString(), foundOtp.otp)
        if (!otpIsCorrect) {
          error = new ClientError('Invalid verification code')
        } else {
          const currentTime = new Date()
          if (currentTime > foundOtp.expiresAt) {
            error = new ClientError('Verification code has expired')
          } else {
            const updatedUser = await userRepository.updateEmailVerified(email)
            if (!updatedUser) {
              error = new ServerError('User could not be updated')
            } else {
              setImmediate(async () => {
                try {
                  await redisService.updateField(
                    `user:${email}`,
                    'emailVerified',
                    true
                  )
                  await redisService.updateField(
                    `user:${updatedUser.id}`,
                    'emailVerified',
                    true
                  )
                  logger.info(`User with email: ${email} verified successfully`)
                } catch (error) {
                  logger.error('Failed to update user:', error)
                }
              })
              data = {
                message: 'Email verified successfully',
                user: {
                  id: updatedUser.id,
                  name: updatedUser.name,
                  email: updatedUser.email,
                  emailVerified: updatedUser.emailVerified,
                },
              }
              await verificationRepository.deleteVerificationCode(foundOtp.id)
            }
          }
        }
      }
      return { error, data }
    } catch (error: any) {
      return { error, data: null }
    }
  }
}
export default AuthService
