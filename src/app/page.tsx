"use client";

// import SignupForm from './components/SignupForm';
import '../app/globals.css';  // Adjust the path to your Tailwind CSS file
import LandingPage from './pages/home';

export default function Home() {
  return (
    <div className="container mx-auto py-8">
    {/* <SignupForm /> */}
    <LandingPage />
  </div>
  );
}
