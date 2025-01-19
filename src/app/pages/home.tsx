"use client";

import React, { useState } from 'react';
import { Users, Heart, User, LogOut, LayoutDashboard } from 'lucide-react';
import SigninForm from '../components/SignForm';
import SignupForm from '../components/SignupForm';
import RegistrationForm from '../components/RegistrationForm';

const LapisLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" className="h-12">
    <text x="0" y="40" fill="#2ba9e1" fontSize="50" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="2">
      LAPIS
    </text>
  </svg>
);

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showSignin, setShowSignin] = useState(false);

  const handleSignIn = (userData) => {
    setUser(userData);
    setShowSignin(false);
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUser(null);
      } else {
        console.error('Sign out failed');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleDashboardClick = () => {
    window.location.href = '/dashboard';
  };

  // Authentication Navbar
  const AuthNavbar = () => (
    <nav className="p-4 bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <LapisLogo />
          <span className="ml-4 text-sky-600">Ramadan Project</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-800">{user?.name || 'User'}</span>
          </div>
          
          <button 
            onClick={handleDashboardClick}
            className="flex items-center gap-2 px-3 py-1.5 border border-sky-300 rounded-md hover:bg-sky-50 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4 text-sky-500" />
            Dashboard
          </button>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );

  // Main Content
  const MainContent = () => (
    <>
      {/* Navigation */}
      <nav className="p-6 bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <LapisLogo />
            <span className="ml-4 text-sky-600">Ramadan Project</span>
          </div>
          <div className="space-x-4">
            <button 
              onClick={() => setShowSignin(true)}
              className="px-4 py-2 rounded-lg border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => setShowSignup(true)} 
              className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold leading-tight">
            Join the Spirit of Giving
          </h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Be part of something meaningful this Ramadan. Volunteer with us to help distribute meals, organize iftars, and support those in need across Dubai.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex justify-center space-x-6 pt-8">
            <button 
              onClick={() => setShowSignup(true)}
              className="px-8 py-4 rounded-lg bg-white text-sky-600 hover:bg-opacity-90 transition-colors text-lg font-semibold flex items-center"
            >
              <Users className="mr-2" />
              Volunteer Now
            </button>
            <button className="px-8 py-4 rounded-lg bg-transparent border border-white hover:bg-white hover:text-sky-600 transition-colors text-lg font-semibold flex items-center">
              <Heart className="mr-2" />
              Learn More
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-6 rounded-xl bg-white bg-opacity-10 backdrop-blur-lg">
            <h3 className="text-xl font-semibold mb-4">Distribute Meals</h3>
            <p className="text-gray-100">Help us reach thousands of people during iftar time across Dubai.</p>
          </div>
          <div className="p-6 rounded-xl bg-white bg-opacity-10 backdrop-blur-lg">
            <h3 className="text-xl font-semibold mb-4">Organize Events</h3>
            <p className="text-gray-100">Support in organizing community iftars and spiritual gatherings.</p>
          </div>
          <div className="p-6 rounded-xl bg-white bg-opacity-10 backdrop-blur-lg">
            <h3 className="text-xl font-semibold mb-4">Community Support</h3>
            <p className="text-gray-100">Assist in various community service activities throughout Ramadan.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-10 text-center text-gray-100">
        <p>© 2025 LAPIS Group. All rights reserved.</p>
      </footer>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-500 to-sky-700 text-white">
      {/* Show AuthNavbar when user is signed in */}
      {user && <AuthNavbar />}

       {user &&  <RegistrationForm /> }
      {/* Show main content if not signed in */}
      {!user && <MainContent />}

      {/* Auth Modals */}
      {showSignup && (
        <SignupForm 
          isOpen={showSignup} 
          onClose={() => setShowSignup(false)} 
        />
      )}
      
      {showSignin && (
        <SigninForm 
          isOpen={showSignin} 
          onClose={() => setShowSignin(false)} 
          onSignInSuccess={handleSignIn}
        />
      )}
    </div>
  );
};

export default LandingPage;