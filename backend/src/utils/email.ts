import nodemailer from "nodemailer";
import { config } from "../config/config";

const transporter = nodemailer.createTransport({
  host: config.smtpHost || "smtp.gmail.com",
  port: Number(config.smtpPort) || 587,
  secure: false,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"BookMyScreen" <${config.smtpUser || "noreply@bookmyscreen.com"}>`,
    to,
    subject: "Your BookMyScreen OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e5e5e5; border-radius: 12px;">
        <h2 style="color: #1a1a1a; margin-bottom: 8px;">🎬 BookMyScreen</h2>
        <p style="color: #666; font-size: 14px;">Your one-time password for login:</p>
        <div style="background: #f5f5f5; padding: 16px 24px; border-radius: 8px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${otp}</span>
        </div>
        <p style="color: #999; font-size: 12px;">This OTP is valid for 5 minutes. Do not share it with anyone.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed:", error);
    // Don't throw — log and continue (for dev environments without SMTP)
    console.log(`[DEV] OTP for ${to}: ${otp}`);
  }
};
