import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const testEmail = async () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  console.log('Testing email with:', user);

  if (!user || !pass) {
    console.error('EMAIL_USER or EMAIL_PASS not found in .env');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"LocalLink Test" <noreply@locallink.com>',
      to: user, // Send to self for testing
      subject: 'Email Test',
      text: 'If you receive this, the email configuration is working.',
    });
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};

testEmail();
