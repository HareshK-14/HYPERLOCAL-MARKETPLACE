import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a reusable transporter using default SMTP transport
// By default we use Ethereal email (a fake SMTP service mostly aimed at Node.js developers)
// or standard console logging if no credentials are provided.
export const sendVerificationEmail = async (to, otpCode) => {
  try {
    const isResend = process.env.EMAIL_PASS && process.env.EMAIL_PASS.startsWith('re_');
    const isMock = !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_app_password_here';

    // ── Resend HTTP API (most reliable – uses port 443) ──────────────────────
    if (isResend) {
      console.log(`Sending OTP email to: ${to} via Resend HTTP API...`);

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.EMAIL_PASS}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'LocalLink Support <onboarding@resend.dev>',
          to: [to],
          subject: 'Your LocalLink Verification Code',
          text: `Your 6-digit verification code is: ${otpCode}. This code is valid for 15 minutes.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
              <h2 style="color: #2563eb; text-align: center;">Welcome to LocalLink!</h2>
              <p style="color: #4b5563; font-size: 16px;">Hi there,</p>
              <p style="color: #4b5563; font-size: 16px;">Thank you for registering! Use the code below to verify your account:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px; border: 2px dashed #3b82f6; padding: 12px 24px; border-radius: 8px; display: inline-block;">${otpCode}</span>
              </div>
              <p style="color: #4b5563; font-size: 14px; text-align: center;">This code expires in <strong>15 minutes</strong>.</p>
              <hr style="border: none; border-top: 1px solid #eaeaec; margin: 30px 0;" />
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">If you didn't create a LocalLink account, please ignore this email.</p>
            </div>
          `,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Resend API error:', result);
        return false;
      }

      console.log('OTP email sent successfully via Resend. ID:', result.id);
      return true;
    }

    // ── Mock mode (no credentials set) ───────────────────────────────────────
    if (isMock) {
      console.log('================================================');
      console.log('MOCK EMAIL - No credentials configured');
      console.log(`To: ${to} | OTP: ${otpCode}`);
      console.log('================================================');
      return true;
    }

    // ── Gmail SMTP fallback ───────────────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log(`Attempting to send OTP email to: ${to} via Gmail SMTP`);

    const info = await transporter.sendMail({
      from: `"LocalLink Support" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your LocalLink Verification Code',
      text: `Your 6-digit verification code is: ${otpCode}. Valid for 15 minutes.`,
      html: `<div style="font-family:Arial,sans-serif;text-align:center;padding:30px;">
        <h2 style="color:#2563eb;">Your verification code</h2>
        <p style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#2563eb;">${otpCode}</p>
        <p>Valid for 15 minutes.</p>
      </div>`,
    });

    console.log('Gmail OTP email sent. Message ID:', info.messageId);
    return true;

  } catch (error) {
    console.error('Failed to send OTP email:', error.message);
    return false;
  }
};
