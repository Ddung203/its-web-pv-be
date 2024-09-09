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
        to: "duongdung10001@gmail.com",
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
      // Log error
      next(error);
    }
  };

  static sendEmails = async (req: Request, res: Response, next: NextFunction) => {
    let { senderSubject, recipients } = req.body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        success: false,
        payload: { senderSubject, recipients },
        message: "Recipient emails are required.",
      });
    }

    const results = [];
    const errorResults = [];

    for (const recipient of recipients) {
      const mailOptions = {
        from: "cuoicuoi1000@gmail.com",
        bcc: "duongdung10001@gmail.com",
        to: recipient.studentEmail,
        subject: senderSubject,
        html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>IT Supporter</title>
    <style>
      body {
        line-height: 1.5;
      }
      a,
      strong {
        text-decoration: none;
        color: #ff9800;
        font-weight: bold;
      }

      .centedr {
        text-align: justify;
      }
    </style>
  </head>
  <body>
    <div style="max-width: 800px; margin: 0 auto 0 auto; padding: 12px">
      <h3>Thông báo kết quả xét tuyển Cộng tác viên năm 2024</h3>

      <div
        style="
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 20px;
        "
      >
        <img
          src="https://firebasestorage.googleapis.com/v0/b/upload-images-42481.appspot.com/o/logos%2Flogofull.png?alt=media&token=d57eeec4-75fe-497a-a43f-80822d43527e"
          height="40px"
        />
        <p>Xin chào <b style="color: #ff9800"> ${recipient.studentName} </b>,</p>
        <p class="center">
          Trong những ngày vừa qua,
          <b style="color: #ff9800">IT Supporter</b> rất vui vì nhận được đơn
          ứng tuyển của bạn. Sau quá trình làm bài test và phỏng vấn, chúng mình
          đã có kết quả dành cho bạn. <br />
          Xin <b style="color: #ff9800"> CHÚC MỪNG </b> bạn đã trở thành một
          Cộng tác viên mới của CLB hỗ trợ kỹ thuật IT Supporter.<br /><br />
          <b
            >Dưới đây là một số thông tin cá nhân bạn cần xác nhận để hoàn thành
            quá trình ứng tuyển <br />
            và một số hướng dẫn cho việc tham gia buổi họp đầu tiên của các bạn
            với CLB:</b
          >
        </p>
        <ul>
          <li><b>Mã sinh viên</b>: ${recipient.studentCode}</li>
          <li><b>Lớp</b>: ${recipient.studentClass}</li>
          <li><b>Điện thoại</b>: ${recipient.studentPhone}</li>
          <li><b>Quê quán</b>: ${recipient.studentHometown}</li>
          <li>
            <b>Zalo Gen11</b>:
            <a
              target="_blank"
              href="https://zalo.me/g/qkhavc283"
              >Tại đây</a
            >
          </li>
          <li>
            <b>Thời gian bắt đầu buổi họp:</b
            ><b style="color: #ff9800"> 17 giờ 30 phút</b>, thứ Năm, ngày 05
            tháng 10 năm 2024
          </li>
          <li>
            <b>Địa điểm: </b>
            <strong>Canteen C123</strong>, Cơ sở 3, Trường Đại học Công nghiệp
            Hà Nội
          </li>
          <li>
            Nếu có bất kì thông tin cá nhân nào chưa chính xác hoặc bạn có bất
            kì thắc mắc nào, <br />hãy liên hệ với chúng mình
            <a
              href="https://www.facebook.com/itsupporter.haui"
              target="_blank"
              data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/itsupporter.haui&amp;source=gmail&amp;ust=1695756795235000&amp;usg=AOvVaw2epspecFcf-CC4yP4eU1Aq"
              >tại đây</a
            >.
          </li>
        </ul>

        <h3 style="color: #ff9800; text-align: center">
          Hẹn gặp bạn tại buổi họp!
        </h3>
      </div>

      <div style="margin-top: 20px; text-align: center">
        © 2024 - Câu lạc bộ Hỗ trợ kỹ thuật IT Supporter
      </div>
    </div>
  </body>
</html>`,
      };

      try {
        const user = await User.findOne({ studentCode: recipient.studentCode });
        if (!user) {
          throw new BadRequestError(`User with studentCode ${recipient.studentCode} not found.`);
        }
        const info = await transporter.sendMail(mailOptions);

        if (info.accepted.includes(recipient.studentEmail) && info.envelope.to.includes(recipient.studentEmail)) {
          results.push({
            recipientEmail: recipient.studentEmail,
            status: "Success",
            messageId: info.messageId,
          });

          user.isReceivedMail = 1;

          await user.save();
        } else {
          errorResults.push({
            recipientEmail: recipient.studentEmail,
            status: "Failed",
            error: "Email was not accepted by the server!",
          });
        }
      } catch (error) {
        logger.error(error);

        errorResults.push({
          recipient,
          status: "Failed",
          error,
        });
      }
    }

    return res.status(HttpStatusCode.OK).json({
      success: true,
      payload: { results, errorResults },
      message: "Emails have been processed.",
    });
  };
}

export default EmailController;
