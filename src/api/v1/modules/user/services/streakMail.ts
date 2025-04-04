function generateBadgeEmail(name: string, streak: number, title: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Congratulations on Earning a Badge!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 20px; background-color: #ffffff;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <!-- Header Section -->
                <tr>
                  <td align="center" style="padding: 10px;">
                    <img src="https://res.cloudinary.com/di1uklizr/image/upload/v1730229077/simesta_logo_colored-2d_cxva11.png" alt="Simesta AI Logo" style="width: 60px; height: 60px;" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 28px; font-weight: bold; color: #333333; padding-top: 20px;">
                    ${title}
                  </td>
                </tr>

                <!-- Badge Section -->
                <tr>
                  <td align="center" style="padding: 30px 0; border-radius: 50px;">
                    <img src="https://res.cloudinary.com/di1uklizr/image/upload/v1733323151/3-day-badge-banner_xnqoge.png" alt="Badge Earned" style="width: 90%;" />
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 20px; font-weight: bold; color: #7c4cf4;">
                    You've earned the ${streak}-day streak badge!
                  </td>
                </tr>

                <!-- Message Section -->
                <tr>
                  <td style="font-size: 16px; color: #333333; padding: 20px;">
                    <p>Hi ${name},</p>
                    <p>Congratulations on reaching an amazing milestone in your learning journey! This badge celebrates your <strong>${streak} consecutive days of learning</strong>.</p>
                    <p>Your dedication is truly inspiring, and we can't wait to see what you'll achieve next. Keep up the fantastic work and continue striving for greatness with Simesta AI!</p>
                  </td>
                </tr>

                <!-- Call-to-Action Section -->
                <tr>
                  <td align="center" style="padding: 20px;">
                    <a href="https://simesta.ai" style="text-decoration: none;">
                      <div style="display: inline-block; padding: 15px 40px; background-color: #7c4cf4; color: #ffffff; font-size: 16px; font-weight: bold; border-radius: 5px;">
                        View My Achievements
                      </div>
                    </a>
                  </td>
                </tr>

                <!-- Footer Section -->
                <tr>
                  <td align="center" style="border-top: 1px solid #cccccc; padding-top: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding: 10px;">
                          <a href="https://www.linkedin.com/company/104287897/" style="text-decoration: none; color: #7c4cf4;">
                            <span style="display: inline-block; width: 40px; height: 40px; border: 2px solid #7c4cf4; border-radius: 50%; text-align: center; line-height: 38px; font-weight: 900; font-size: 18px;">in</span>
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
    </html>
  `;
}


export default generateBadgeEmail