"use client";

import React, { useState } from 'react';
import Input from "./ui/input";
import { Mail, KeyRound, ArrowRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

type Step = 'email' | 'otp';

export default function SigninForm({ 
  isOpen, 
  onClose, 
  onSignInSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSignInSuccess: (userData: any) => void;
}) {
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
            const res = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, isSignIn: true })
            });

            const data = await res.json();

            if (data.success) {
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
            const res = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, isSignIn: true })
            });

            const data = await res.json();

            if (data.success) {
                // Call onSignInSuccess with user data
                onSignInSuccess(data.user);
            } else {
                setError(data.message || 'Invalid verification code');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = () => {
        if (timer > 0) return;
        handleSendOTP({ preventDefault: () => {} } as React.FormEvent);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
                <div className="relative p-6">
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                    <h2 className="text-2xl font-bold text-center mb-4">
                        Sign in
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                        {step === 'email' 
                            ? 'Enter your email to sign in' 
                            : 'Enter the verification code sent to your email'
                        }
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 flex items-center">
                            <AlertCircle className="mr-2 h-5 w-5" />
                            <AlertDescription>{error}</AlertDescription>
                        </div>
                    )}
                    
                    {step === 'email' ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition-colors flex items-center justify-center"
                                disabled={loading || !email}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                                        Sending...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        Continue
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Enter 6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="pl-10 text-center tracking-[0.5em] font-mono text-lg"
                                    required
                                    maxLength={6}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition-colors"
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2 justify-center">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-b-transparent" />
                                        Verifying...
                                    </div>
                                ) : 'Sign in'}
                            </button>
                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep('email')}
                                    className="w-full border border-sky-300 text-sky-500 py-2 rounded-lg hover:bg-sky-50 transition-colors"
                                >
                                    Change Email
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={timer > 0}
                                    className="w-full text-sm text-sky-500 hover:bg-sky-50 py-2 rounded-lg transition-colors"
                                >
                                    {timer > 0 ? `Resend code in ${timer}s` : 'Resend code'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}