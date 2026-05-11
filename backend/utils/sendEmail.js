import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a reusable transporter using default SMTP transport
// By default we use Ethereal email (a fake SMTP service mostly aimed at Node.js developers)
// or standard console logging if no credentials are provided.
export const sendVerificationEmail = async (to, verificationLink) => {
  try {
    // If you have real SMTP credentials in .env, use those.
    // Otherwise, we fallback to just logging the link (useful for local development).
    const isMock = !process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your_app_password_here';
    
    let transporter;
    
    if (isMock) {
      console.log('================================================');
      console.log('MOCK EMAIL SENDING (No Gmail credentials found)');
      console.log(`To: ${to}`);
      console.log(`Subject: Verify Your LocalLink Account`);
      console.log(`Verification Link: ${verificationLink}`);
      console.log('================================================');
      return true; // Pretend it sent successfully
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log(`Attempting to send email to: ${to} using ${process.env.EMAIL_USER}`);

    const info = await transporter.sendMail({
      from: `"LocalLink Support" <${process.env.EMAIL_USER}>`, // sender address must match Gmail user
      to: to, // list of receivers
      subject: 'Verify Your LocalLink Account', // Subject line
      text: `Welcome to LocalLink! Please verify your email by clicking the following link: ${verificationLink}`, // plain text body
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">Welcome to LocalLink!</h2>
          <p style="color: #4b5563; font-size: 16px;">Hi there,</p>
          <p style="color: #4b5563; font-size: 16px;">Thank you for registering. Please click the button below to verify your email address and activate your account.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email</a>
          </div>
          <p style="color: #4b5563; font-size: 14px;">If the button doesn't work, you can also copy and paste the following link into your browser:</p>
          <p style="color: #3b82f6; font-size: 14px; word-break: break-all;"><a href="${verificationLink}">${verificationLink}</a></p>
          <hr style="border: none; border-top: 1px solid #eaeaec; margin: 30px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">If you didn't create an account with LocalLink, please ignore this email.</p>
        </div>
      `, // html body
    });

    console.log('Verification email sent successfully. Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('CRITICAL ERROR: Failed to send verification email.');
    console.error('Error details:', error.message);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check if EMAIL_USER and EMAIL_PASS (App Password) are correct.');
    }
    return false;
  }
};
