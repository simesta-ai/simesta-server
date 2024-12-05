function generateCourseCreationEmail(name: string, courseTitle: string) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Course Created!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Poppins', Arial, sans-serif; color: #ffffff;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; border-collapse: collapse; overflow: hidden; background-color: #ffffff;">
        
        <!-- Header Section -->
        <tr>
          <td align="center" style="background-image: url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&auto=format&fit=crop&q=80'); background-size: cover; background-position: center; padding: 50px 20px;">
            <img src="https://res.cloudinary.com/di1uklizr/image/upload/v1730229077/simesta_logo_colored-2d_cxva11.png" alt="Simesta AI Logo" style="width: 80px; height: auto;" />
            <h1 style="font-size: 36px; color: #fdfdfd; text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5); margin: 10px 0;">
              New Course Successfully Created!
            </h1>
          </td>
        </tr>
    
        <!-- Main Content Section -->
        <tr>
          <td align="center" style="padding: 30px;">
            <h2 style="font-size: 28px; color: #1b1b1b;">Hello, ${name}!</h2>
            <p style="font-size: 18px; line-height: 1.6; color: #232323; margin: 15px 0;">
              You've taken a step in your learning journey with a brand-new course titled:
            </p>
            <p style="font-size: 20px; font-weight: bold; color: #232323; margin: 15px 0;">“${courseTitle}”</p>
            <p style="font-size: 18px; line-height: 1.6; color: #232323; margin: 15px 0;">
              Your course is now live and you can begin your learning journey. We can't wait to see the impact your course will have!
            </p>
            <a href="[Course Link]" style="display: inline-block; margin-top: 20px; padding: 15px 30px; font-size: 18px; font-weight: 600; color: #12032d; background: linear-gradient(135deg, #ffaf7b, #ffd36e); border-radius: 50px; text-decoration: none; transition: 0.3s; box-shadow: 0 8px 20px rgba(255, 173, 123, 0.5);">
              View Your Course
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
    </body>
    </html>`;
  }
  
export default generateCourseCreationEmail;
  