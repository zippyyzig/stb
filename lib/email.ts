import nodemailer from "nodemailer";

// SMTP Configuration using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Company email for notifications
export const COMPANY_EMAIL = process.env.COMPANY_EMAIL || process.env.SMTP_USER || "";
export const COMPANY_NAME = process.env.COMPANY_NAME || "Sabka Tech Bazar";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const EMAIL_FROM = process.env.EMAIL_FROM || process.env.SMTP_USER || "";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions): Promise<boolean> {
  try {
    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error("[v0] Email error: SMTP_USER or SMTP_PASSWORD not configured");
      return false;
    }

    const fromAddress = EMAIL_FROM || process.env.SMTP_USER;
    
    console.log(`[v0] Sending email to ${to} from ${fromAddress}`);
    
    await transporter.sendMail({
      from: `"${COMPANY_NAME}" <${fromAddress}>`,
      to,
      subject,
      html,
      replyTo: replyTo || COMPANY_EMAIL,
    });
    console.log(`[v0] Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("[v0] Error sending email:", error);
    return false;
  }
}

// Verify SMTP connection
export async function verifyEmailConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      return { 
        success: false, 
        error: "SMTP_USER or SMTP_PASSWORD not configured" 
      };
    }
    
    await transporter.verify();
    console.log("[v0] SMTP connection verified");
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[v0] SMTP connection failed:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
