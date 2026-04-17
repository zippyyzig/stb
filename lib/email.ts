import nodemailer from "nodemailer";

// Gmail SMTP Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL || "sabkatechbazarr@gmail.com",
    pass: process.env.SMTP_PASSWORD || "xlgz oqow jakm ipje",
  },
});

// Company email for notifications
export const COMPANY_EMAIL = process.env.COMPANY_EMAIL || "sabkatechbazarr@gmail.com";
export const COMPANY_NAME = process.env.COMPANY_NAME || "SabKaTechBazar";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"${COMPANY_NAME}" <${COMPANY_EMAIL}>`,
      to,
      subject,
      html,
      replyTo: replyTo || COMPANY_EMAIL,
    });
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Verify SMTP connection
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log("SMTP connection verified");
    return true;
  } catch (error) {
    console.error("SMTP connection failed:", error);
    return false;
  }
}
