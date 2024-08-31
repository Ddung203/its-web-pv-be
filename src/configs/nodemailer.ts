import * as dotenv from "dotenv";
import { createTransport } from "nodemailer";

dotenv.config();

// nodemailer.config.js
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_AUTH_USER || "",
    pass: process.env.EMAIL_AUTH_PASS || "",
  },
});

export default transporter;
