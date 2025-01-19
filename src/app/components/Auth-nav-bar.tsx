import React from 'react';
import { User, LogOut, LayoutDashboard } from "lucide-react";

interface AuthNavbarProps {
  userName: string;
  onSignOut: () => void;
  onDashboardClick: () => void;
}

export default function AuthNavbar({ userName, onSignOut, onDashboardClick }: AuthNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-800">{userName}</span>
          </div>
          
          <button 
            onClick={onDashboardClick}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
        </div>
        
        <button 
          onClick={onSignOut}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}