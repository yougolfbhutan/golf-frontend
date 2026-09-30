// src/lib/mailer.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true", // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
}) {
  return transporter.sendMail({
    from: process.env.MAIL_FROM ?? `"Golf Booking" <${process.env.SMTP_USER}>`,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}