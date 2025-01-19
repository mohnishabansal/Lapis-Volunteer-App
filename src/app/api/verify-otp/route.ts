// src/app/api/verify-otp/route.ts
import { NextResponse } from 'next/server';

// Simulated user database (in a real app, this would be a database query)
const userDatabase = {
  'john@example.com': { 
    name: 'John Doe', 
    email: 'john@example.com',
    role: 'volunteer'
  },
  'sarah@example.com': { 
    name: 'Sarah Smith', 
    email: 'sarah@example.com',
    role: 'admin'
  }
};

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

      // Retrieve user information 
      const user = userDatabase[email] || { 
        name: email.split('@')[0], 
        email: email,
        role: 'user'
      };

      return NextResponse.json({ 
        success: true, 
        user: user 
      });
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