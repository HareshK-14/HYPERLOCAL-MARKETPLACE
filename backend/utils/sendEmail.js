import dotenv from 'dotenv';

dotenv.config();

// Sends OTP verification email using:
// 1. Resend HTTP API (if EMAIL_PASS starts with 're_') - works on all servers
// 2. No-op mock (if no credentials set) - logs OTP to console
export const sendVerificationEmail = async (to, otpCode) => {
  try {
    const isMock =
      !process.env.EMAIL_PASS ||
      process.env.EMAIL_PASS === 'your_app_password_here';

    if (isMock) {
      console.log('================================================');
      console.log('MOCK EMAIL (No credentials found)');
      console.log(`To: ${to}`);
      console.log(`OTP Code: ${otpCode}`);
      console.log('================================================');
      return true;
    }

    const isResend = process.env.EMAIL_PASS.startsWith('re_');

    if (isResend) {
      // Use Resend HTTP API directly (works on Render - no SMTP port blocks)
      console.log(`Sending OTP to: ${to} via Resend HTTP API`);

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
          text: `Your 6-digit verification code is: ${otpCode}. Valid for 15 minutes.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaec; border-radius: 10px;">
              <h2 style="color: #2563eb; text-align: center;">Welcome to LocalLink!</h2>
              <p style="color: #4b5563; font-size: 16px;">Hi there,</p>
              <p style="color: #4b5563; font-size: 16px;">Use the following 6-digit OTP to verify your account:</p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 40px; font-weight: bold; color: #2563eb; letter-spacing: 8px; border: 2px dashed #3b82f6; padding: 12px 24px; border-radius: 8px; display: inline-block;">${otpCode}</span>
              </div>
              <p style="color: #4b5563; font-size: 14px; text-align: center;">This code is valid for <strong>15 minutes</strong>.</p>
              <hr style="border: none; border-top: 1px solid #eaeaec; margin: 30px 0;" />
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">If you didn't create a LocalLink account, you can safely ignore this email.</p>
            </div>
          `,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Resend API error:', JSON.stringify(data));
        return false;
      }

      console.log('OTP email sent successfully via Resend. ID:', data.id);
      return true;
    }

    // Fallback: log to console if provider unknown
    console.log('Unknown email provider. OTP Code (for dev):', otpCode);
    return true;
  } catch (error) {
    console.error('CRITICAL ERROR: Failed to send OTP email:', error.message);
    return false;
  }
};
