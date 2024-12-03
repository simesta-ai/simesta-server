const streakCongratulatoryEmail = (name: string, streak: number) => {
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Congratulations on Your Streak!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 20px; background-color: #ffffff;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding: 10px; display: flex; align-items: center; justify-content: center;">
                    <img src="https://res.cloudinary.com/di1uklizr/image/upload/v1730229077/simesta_logo_colored-2d_cxva11.png" alt="Simesta AI Logo" style="width: 50px; height: 50px;" />
                    <p style="font-weight: 600; margin-left: 10px; color: #333333;">Simesta AI</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 24px; font-weight: bold; color: #333333; padding-top: 30px;">
                    Congratulations, ${name}! 🎉
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 16px; color: #333333; padding: 20px;">
                    <p style="text-align: start;">Hi ${name},</p>
                    <p>You're on an incredible streak! You've maintained your learning streak for <strong>${streak} days</strong> in a row. Keep up the amazing momentum! 🌟</p>
                    <p>Your dedication to learning is inspiring, and every step you take brings you closer to achieving your goals. Simesta AI is here to support you every step of the way.</p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 20px;">
                    <a href="https://simesta.ai" style="text-decoration: none;">
                      <div style="display: inline-block; padding: 15px 50px; background-color: #7c4cf4; color: #ffffff; font-size: 16px; font-weight: bold; border-radius: 5px; text-transform: uppercase;">
                        Continue Learning Now
                      </div>
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 16px; color: #333333; padding: 20px;">
                    <p>Remember, consistency is key! Keep going, and let’s see how far your streak can go!</p>
                    <p>Keep shining,<br /><strong>The Simesta AI Team</strong></p>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="border-top: 1px solid #cccccc; padding-top: 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding: 10px;">
                          <a href="https://www.linkedin.com/company/104287897/" style="text-decoration: none; color: #7c4cf4;">
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
    </html>`;
  };
  
  export default streakCongratulatoryEmail;
  