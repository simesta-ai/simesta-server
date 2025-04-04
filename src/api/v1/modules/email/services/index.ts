import EmailRepository from '../repository'
import UserRepository from '../../user/repository'
import nodemailer from 'nodemailer'

const emailRepository = new EmailRepository()
const userRepository = new UserRepository()

class EmailService {
  async sendMail(to: string, subject: string, text?: string, html?: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.HOST_EMAIL_ADDRESS,
        pass: process.env.HOST_EMAIL_PASSWORD,
      },
    })
    const mailOptions = {
      from: `Simesta AI <${process.env.HOST_EMAIL_ADDRESS}>`,
      to,
      subject,
      text: text ? text : '',
      html: html ? html : '',
    }
    const mailResponse = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve({
            message: 'Mail sent',
            email: to,
          })
        }
      })
    })
    if (mailResponse) return mailResponse
    return null
  }

}


export default EmailService