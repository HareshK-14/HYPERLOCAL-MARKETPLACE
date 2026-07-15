import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a reusable transporter using default SMTP transport
// By default we use Ethereal email (a fake SMTP service mostly aimed at Node.js developers)
// or standard console logging if no credentials are provided.
export const sendVerificationEmail = async (to, otpCode) => {
  try {
    const isMock = !process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_app_password_here';
    
    let transporter;
    
    if (isMock) {
      console.log('================================================');
      console.log('MOCK EMAIL SENDING (No Gmail credentials found)');
      console.log(`To: ${to}`);
      console.log(`Subject: Verify Your LocalLink Account (OTP Code)`);
      console.log(`OTP Code: ${otpCode}`);
      console.log('================================================');
      return true; // Pretend it sent successfully
    }

    const isResend = process.env.EMAIL_PASS.startsWith('re_');
    let senderEmail = process.env.EMAIL_USER;

    if (isResend) {
      // Resend SMTP Configuration - using port 587 (STARTTLS) to prevent connection timeouts
      transporter = nodemailer.createTransport({
        host: 'smtp.resend.com',
        port: 587,
        secure: false,
        auth: {
          user: 'resend',
          pass: process.env.EMAIL_PASS, // Resend API Key starts with 're_'
        },
      });
      // Free tier Resend requires sender to be onboarding@resend.dev
      senderEmail = 'onboarding@resend.dev';
      console.log(`Attempting to send OTP email to: ${to} using Resend SMTP`);
    } else {
      // Gmail SMTP Configuration
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      console.log(`Attempting to send OTP email to: ${to} using Gmail SMTP`);
    }

    const info = await transporter.sendMail({
      from: `"LocalLink Support" <${senderEmail}>`, // sender address
      to: to, // list of receivers
      subject: 'Verify Your LocalLink Account (OTP Code)', // Subject line
      text: `Welcome to LocalLink! Your 6-digit verification code is: ${otpCode}. This code is valid for 15 minutes.`, // plain text body
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">Welcome to LocalLink!</h2>
          <p style="color: #4b5563; font-size: 16px;">Hi there,</p>
          <p style="color: #4b5563; font-size: 16px;">Thank you for registering. Please use the following 6-digit One-Time Password (OTP) to verify your account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 6px; border: 2px dashed #3b82f6; padding: 10px 20px; border-radius: 8px; display: inline-block;">${otpCode}</span>
          </div>
          <p style="color: #4b5563; font-size: 14px; text-align: center;">This code is valid for 15 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eaeaec; margin: 30px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">If you didn't create an account with LocalLink, please ignore this email.</p>
        </div>
      `, // html body
    });

    console.log('OTP verification email sent successfully. Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('CRITICAL ERROR: Failed to send OTP verification email.');
    console.error('Error details:', error.message);
    return false;
  }
};
