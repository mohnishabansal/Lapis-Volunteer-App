"use client";

import React, { useState } from 'react';
import Input from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Mail, KeyRound, ArrowRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

type Step = 'email' | 'otp';

export default function SigninForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<Step>('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(0);

    if (!isOpen) return null;

    const startResendTimer = () => {
        setTimer(30);
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // First, check if the user exists
            const checkUserRes = await fetch('/api/auth/check-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const checkUserData = await checkUserRes.json();

            if (!checkUserRes.ok) {
                setError('Account not found. Please sign up first.');
                setLoading(false);
                return;
            }

            // If user exists, proceed with sending OTP
            const res = await fetch('/api/signin/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setStep('otp');
                startResendTimer();
            } else {
                setError(data.message || 'Failed to send verification code');
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
            const res = await fetch('/api/signin/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect to dashboard on successful verification
                window.location.href = '/dashboard';
            } else {
                setError(data.message || 'Invalid verification code');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (timer > 0) return;
        await handleSendOTP({ preventDefault: () => {} } as React.FormEvent);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md shadow-lg">
                <div className="relative">
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                    <CardHeader className="space-y-1 pb-8">
                        <CardTitle className="text-3xl font-bold tracking-tight text-center">
                            Sign in
                        </CardTitle>
                        <CardDescription className="text-center text-gray-500">
                            {step === 'email' 
                                ? 'Enter your email to sign in' 
                                : 'Enter the verification code sent to your email'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === 'email' && (
                            <form onSubmit={handleSendOTP} className="space-y-6">
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12"
                                        required
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 text-base font-medium"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                                            Checking...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            Continue
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    )}
                                </Button>
                            </form>
                        )}

                        {step === 'otp' && (
                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="pl-10 text-center tracking-[1em] h-12 font-mono text-lg"
                                        required
                                        maxLength={6}
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 text-base font-medium"
                                    disabled={loading || otp.length !== 6}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                                            Verifying...
                                        </div>
                                    ) : 'Sign in'}
                                </Button>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setStep('email')}
                                        className="w-full h-11"
                                    >
                                        Change Email
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleResendOTP}
                                        disabled={timer > 0}
                                        className="w-full h-11 text-sm"
                                    >
                                        {timer > 0 ? `Resend code in ${timer}s` : 'Resend code'}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {error && (
                            <Alert variant="destructive" className="mt-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </div>
            </Card>
        </div>
    );
}