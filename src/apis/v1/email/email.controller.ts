import { NextFunction, Request, Response } from "express";
import HttpStatusCode from "../../../enums/HttpStatusCode";
import transporter from "../../../configs/nodemailer";

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
}

export default EmailController;
