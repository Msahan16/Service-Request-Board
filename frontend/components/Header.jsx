'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication on mount
    const authenticated = authAPI.isAuthenticated();
    const currentUser = authAPI.getCurrentUser();
    setIsAuthenticated(authenticated);
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
    router.push('/');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold leading-tight">Service Request Board</h1>
            <p className="text-blue-100 text-sm mt-1">Find and manage home service requests</p>
          </div>
          <nav className="hidden md:flex gap-4 items-center">
            <a href="/" className="hover:text-blue-100 transition font-medium">Home</a>
            {isAuthenticated ? (
              <>
                <a href="/jobs/new" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
                  Post a Job
                </a>
                <span className="text-blue-100">|</span>
                <span className="text-sm">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-blue-100 hover:text-white transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="hover:text-blue-100 transition font-medium">
                  Sign In
                </a>
                <a href="/register" className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
                  Sign Up
                </a>
              </>
            )}
          </nav>
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex gap-3">
          <a href="/" className="flex-1 text-center py-2 bg-blue-500 rounded-lg hover:bg-blue-400 transition font-medium text-sm">Home</a>
          {isAuthenticated ? (
            <>
              <a href="/jobs/new" className="flex-1 text-center py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-sm">Post Job</a>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition font-medium text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="flex-1 text-center py-2 bg-blue-500 rounded-lg hover:bg-blue-400 transition font-medium text-sm">Sign In</a>
              <a href="/register" className="flex-1 text-center py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition text-sm">Sign Up</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
