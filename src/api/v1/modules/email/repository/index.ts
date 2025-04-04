import prisma from '../../../../../config/db/prisma'

const otpModel = prisma.otp

export interface IOtp {
  id: string
  otp: string
  email: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

class EmailRepository {
  // VERIFICATION METHODS

  public async createVerificationCode(
    otp: string,
    email: string,
    expiresAt: Date
  ): Promise<IOtp | null> {
    try {
      const newOtp = await otpModel.create({
        data: {
          otp,
          email,
          expiresAt,
        },
      })
      return newOtp
    } catch (error) {
      return null
    }
  }

  public async getVerificationCode(email: string): Promise<IOtp | null> {
    try {
      const foundOtp = await otpModel.findFirst({
        where: {
          email,
        },
      })
      return foundOtp
    } catch (error) {
      return null
    }
  }

  public async deleteVerificationCode(id: string): Promise<IOtp | null> {
    try {
      const deletedOtp = await otpModel.delete({
        where: {
          id,
        },
      })
      return deletedOtp
    } catch (error) {
      return null
    }
  }

  //   NOTIFICATION METHODS
}

export default EmailRepository
