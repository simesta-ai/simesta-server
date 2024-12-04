const otpMail = (name: string, otp: number) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Confirm your Simesta Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 20px; background-color: #ffffff;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td align="center" style="padding: 10px; display: flex;">
                  <img src="https://res.cloudinary.com/di1uklizr/image/upload/v1730229077/simesta_logo_colored-2d_cxva11.png" alt="Company Logo" style="width: 50px; height: 50px;" />
                  <p style="font-weight: 600; color:#333333">Simesta AI</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="font-size: 24px; font-weight: bold; color: #333333; padding-top: 30px;">
                  You are almost there!
                </td>
              </tr>
              <tr>
                <td style="font-size: 16px; color: #333333;">
                  <p style="text-align: start;">Hi ${name},</p>
                  <p>One more step to go! Please enter this confirmation code in the window where you started creating your account.</p>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 20px;">
                  <div style="display: inline-block; padding-top: 15px; padding-bottom: 15px; padding-left: 50px; padding-right: 50px; background-color: #ececec; font-size: 24px; font-weight: bold; color: #4f4f4f; letter-spacing: 5px;">
                    ${otp}
                  </div>
                </td>
              </tr>
              <tr>
                <td align="center" style="font-size: 12px; color: #888888; padding: 10px;">
                  This passcode will only be valid for 15 minutes.
                </td>
              </tr>
              <tr>
                <td style="font-size: 16px; color: #333333; padding: 10px;">
                  <p>If you did not request this code, please ignore this email.</p>
                  <p>Thank you!<br /><strong>The Simesta Team</strong></p>
                </td>
              </tr>
              <tr>
                <td align="center" style="border-top: 1px solid #cccccc; padding-top: 20px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center" style="padding: 10px;">
                        <a href="https://www.linkedin.com/company/104287897/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3Bn2Oqp3aWTxO7UuLq1ngnWA%3D%3D" style="text-decoration: none; color: #7c4cf4;">
                          <span style="display: inline-block; width: 40px; height: 40px; border: 2px solid #7c4cf4; border-radius: 50%; text-align: center; line-height: 38px; color: #7c4cf4; font-weight: 900; font-size: 18px;">
                            <strong>in</strong>
                          </span>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size: 12px; color: #888888; padding: 10px;">
                        Simesta AI Inc, Lagos, Nigeria.
                      </td>
                    </tr>
                    <tr>
                      <td align="center" style="font-size: 12px; color: #888888; padding: 10px;">
                        Simesta AI&copy; 2024, All rights reserved.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`
}

export default otpMail
