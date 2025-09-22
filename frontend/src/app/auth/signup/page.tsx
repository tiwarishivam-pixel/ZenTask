"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // for navigation

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      // Redirect to dashboard after successful signup
      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md border border-black rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-black mb-6">
          Start Organizing Your Work with Zentask
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black border border-black transition"
          >
            Sign Up
          </button>
        </form>

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

        <p className="mt-6 text-center text-black text-sm">
          Already have an account?{" "}
          <Link href="./login" className="text-black font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
