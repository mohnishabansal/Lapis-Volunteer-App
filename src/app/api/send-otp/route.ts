// src/app/api/send-otp/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

// Type-safe OTP store
type OTPData = {
  code: string;
  expiry: number;
};

// Using global to persist data between API calls in development
declare global {
  // eslint-disable-next-line no-var
  var otpStore: Map<string, OTPData> | undefined;
}

// Initialize OTP store
global.otpStore = global.otpStore || new Map<string, OTPData>();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
} as nodemailer.TransportOptions);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const mailOptions: Mail.Options = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <h1>Verification Code</h1>
        <p>Your code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    };

    // Store OTP
    global.otpStore?.set(email, {
      code: otp,
      expiry: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}