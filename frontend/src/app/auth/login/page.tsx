"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter(); // for navigation

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: { token?: string; message?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md border border-black rounded-xl p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-black">
          Login to Zentask
        </h1>

        {error && (
          <div className="mb-4 rounded-md border border-red-600 bg-red-50 p-3 text-sm text-red-600 transition-all duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full rounded-lg border border-black px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-black">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-black px-3 py-2 text-black text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border border-black bg-black text-white px-4 py-2 text-sm font-semibold shadow-sm transition transform hover:scale-105 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-black text-sm">
          Don't have an account?{" "}
          <Link
            href="./signup"
            className="text-black font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
