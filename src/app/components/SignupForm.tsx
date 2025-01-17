// app/components/SignupForm.tsx
import React, { useState } from 'react';
import Input from "./ui/input"; // Import the Input component
import Button from "./ui/button"; // Import the Button component
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setStep('otp');
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      if (res.ok) {
        setStep('success');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
    <CardHeader>
      <CardTitle>Sign Up</CardTitle>
    </CardHeader>
    <CardContent>
      {step === 'email' && (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <p className="text-sm">Enter the code sent to {email}</p>
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep('email')}
            className="w-full"
          >
            Change Email
          </Button>
        </form>
      )}

      {step === 'success' && (
        <div className="text-center">
          <p className="text-green-600 mb-2">✓ Email verified successfully!</p>
          <p className="text-sm">You can now proceed with registration.</p>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-4">{error}</p>
      )}
    </CardContent>
  </Card>
  );
};

export default SignupForm;