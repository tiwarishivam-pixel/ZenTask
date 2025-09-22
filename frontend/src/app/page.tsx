"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white to-gray-100 text-black flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center p-6 md:px-12 border-b border-gray-200 shadow-sm bg-white sticky top-0 z-50">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Zentask</h1>
        <div className="space-x-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition-all duration-300"
          >
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition-all duration-300"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 md:px-20">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900">
          Organize Your Work <br className="hidden md:block" />
          Simplify Your Tasks
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl">
          Zentask helps you manage projects, tasks, and deadlines efficiently. 
          Collaborate, track, and complete work effortlessly.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <Link
            href="/auth/signup"
            className="px-8 py-3 bg-black text-white rounded-lg font-semibold shadow-lg hover:bg-white hover:text-black border border-black transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-3 border border-black rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Login
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 border-t border-gray-200 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Zentask. All rights reserved.
      </footer>
    </div>
  );
}
