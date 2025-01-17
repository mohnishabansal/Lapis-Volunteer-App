// src/app/api/verify-otp/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();
    
    const storedOTP = global.otpStore?.get(email);
    
    if (!storedOTP || storedOTP.expiry < Date.now()) {
      return NextResponse.json(
        { success: false, message: 'OTP expired or invalid' },
        { status: 400 }
      );
    }

    if (storedOTP.code === otp) {
      // Clear OTP after successful verification
      global.otpStore?.delete(email);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid OTP' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}