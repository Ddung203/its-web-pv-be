import { NextFunction, Request, Response } from "express";
import HttpStatusCode from "../../../enums/HttpStatusCode";
import transporter from "../../../configs/nodemailer";
import User from "../../../models/User";
import { BadRequestError } from "../../../responses/error";
import logger from "../../../configs/logger";

class EmailController {
  static sendFeedback = async (req: Request, res: Response, next: NextFunction) => {
    const { senderName, senderEmail, senderSubject, senderMessage } = req.body;

    try {
      const mailOptions = {
        from: "cuoicuoi1000@gmail.com",
        to: "itsupgen11.noreply@gmail.com",
        bcc: "duongdung10001@gmail.com",
        subject: senderSubject,
        text: `${senderName} (${senderEmail}): ${senderMessage}`,
      };

      const info = transporter.sendMail(mailOptions);

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: null,
        message: "Send mail ok!",
      });
    } catch (error) {
      logger.error("Send Feedback Error", error);

      next(error);
    }
  };

  static async sendEmails(req: Request, res: Response, next: NextFunction) {
    const { senderSubject, recipients } = req.body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        payload: { senderSubject, recipients },
        message: "Recipient emails are required.",
      });
    }

    try {
      const results = await Promise.all(
        recipients.map((recipient) => EmailController.processEmail(recipient, senderSubject)),
      );

      const successResults = results.filter((result) => result.status === "Success");
      const errorResults = results.filter((result) => result.status === "Failed");

      // EmailController.processEmail()

      return res.status(HttpStatusCode.OK).json({
        success: true,
        payload: { successResults, errorResults },
        message: "Emails have been processed.",
      });
    } catch (error) {
      logger.error("Error processing emails:", error);
      next(error);
    }
  }

  private static async processEmail(recipient: any, senderSubject: any) {
    const mailOptions = this.getMailOptions(recipient, senderSubject);

    try {
      const user = await this.findUserByStudentCode(recipient.studentCode);
      const info = await transporter.sendMail(mailOptions);

      if (info.accepted.includes(recipient.studentEmail)) {
        await this.updateUserEmailStatus(user);
        return {
          recipientEmail: recipient.studentEmail,
          status: "Success",
          messageId: info.messageId,
        };
      } else {
        throw new Error("Email was not accepted by the server!");
      }
    } catch (error) {
      logger.error(`Failed to send email to ${recipient.studentEmail}:`, error);
      return {
        recipientEmail: recipient.studentEmail,
        status: "Failed",
        error,
      };
    }
  }

  private static getMailOptions(recipient: any, senderSubject: any) {
    return {
      from: "itsupgen11.noreply@gmail.com",
      bcc: "duongdung10001@gmail.com",
      to: recipient.studentEmail,
      subject: senderSubject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Thông báo từ IT Supporter</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f9; margin: 0; padding: 0; }
              .container { max-width: 800px; margin: 20px auto; padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; }
              h3 { color: #333; }
              a, strong { color: #ff9800; text-decoration: none; font-weight: bold; }
              .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #555; }
              .unsubscribe { color: #007bff; text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="container">
              <h3>Kết quả xét tuyển Cộng tác viên năm 2024</h3>
              <div>
                <img src="https://firebasestorage.googleapis.com/v0/b/upload-images-42481.appspot.com/o/logos%2Flogofull.png?alt=media&token=d57eeec4-75fe-497a-a43f-80822d43527e" height="40px" alt="IT Supporter Logo" />
                <p>Xin chào <b>${recipient.studentName}</b>,</p>
                <p>Chúng mình rất vui khi nhận được đơn ứng tuyển của bạn. Sau khi xem xét kết quả bài test và buổi phỏng vấn, chúng mình xin chúc mừng bạn đã trở thành Cộng tác viên mới của CLB Hỗ trợ kỹ thuật IT Supporter.</p>
                <p><b>Vui lòng xác nhận các thông tin cá nhân dưới đây:</b></p>
                <ul>
                  <li><b>Mã sinh viên:</b> ${recipient.studentCode}</li>
                  <li><b>Lớp:</b> ${recipient.studentClass}</li>
                  <li><b>Điện thoại:</b> ${recipient.studentPhone}</li>
                  <li><b>Quê quán:</b> ${recipient.studentHometown}</li>
                  <li><b>Tham gia nhóm Zalo Gen11:</b> <a href="https://zalo.me/g/tywmxz174" target="_blank">Tại đây</a></li>
                  <li><b>Thời gian họp:</b> 17:30, thứ Năm, 05/10/2024</li>
                  <li><b>Địa điểm:</b> Canteen C123, Cơ sở 3, Trường Đại học Công nghiệp Hà Nội</li>
                </ul>
                <p>Nếu có bất kỳ thông tin nào chưa chính xác, hãy liên hệ với chúng mình qua <a href="https://www.facebook.com/itsupporter.haui" target="_blank">Facebook</a>.</p>
                <h3 style="color: #ff9800; text-align: center;">Hẹn gặp lại bạn tại buổi họp!</h3>
              </div>
              <div class="footer">
                © 2024 - CLB Hỗ trợ kỹ thuật IT Supporter
              </div>
            </div>
          </body>
        </html>`,
    };
  }

  private static async findUserByStudentCode(studentCode: any) {
    const user = await User.findOne({ studentCode, isPassed: 1 });
    if (!user) {
      throw new Error(`User with studentCode ${studentCode} not found.`);
    }
    return user;
  }

  private static async updateUserEmailStatus(user: any) {
    user.isReceivedMail = 1;
    await user.save();
  }
}

export default EmailController;
