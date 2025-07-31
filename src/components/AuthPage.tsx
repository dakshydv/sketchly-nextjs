"use client";
import { useState } from "react";
import React from "react";
import { CreateUserSchema, SignInSchema } from "@/config/schema";
import { FormData } from "@/config/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AuthPage({ isSignIn }: { isSignIn: boolean }) {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const validateField = (name: string, value: string) => {
    const newFieldErrors = { ...fieldErrors };

    try {
      if (isSignIn) {
        if (name === "email") {
          SignInSchema.shape.email.parse(value);
          delete newFieldErrors.email;
        } else if (name === "password") {
          SignInSchema.shape.password.parse(value);
          delete newFieldErrors.password;
        }
      } else {
        if (name === "name") {
          CreateUserSchema.shape.name?.parse(value);
          delete newFieldErrors.name;
        } else if (name === "email") {
          CreateUserSchema.shape.email.parse(value);
          delete newFieldErrors.email;
        } else if (name === "password") {
          CreateUserSchema.shape.password.parse(value);
          delete newFieldErrors.password;
        }
      }
    } catch (err) {
      console.log(err);
    }

    setFieldErrors(newFieldErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError(null);

    if (value.trim() || fieldErrors[name as keyof typeof fieldErrors]) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      if (isSignIn) {
        SignInSchema.parse({ email: form.email, password: form.password });
      } else {
        CreateUserSchema.parse({
          email: form.email,
          password: form.password,
        });
      }

      setFieldErrors({});

      if (isSignIn) {
        const response = await axios.post<{ message: string; token: string }>(
          "/api/signin",
          {
            name: form.name,
            email: form.email,
            password: form.password,
          }
        );
        if (response.status === 200) {
          localStorage.setItem("authorization", response.data.token);
          router.push("/dashboard");
        } else {
          setError(response.data.message);
        }
      } else {
        const response = await axios.post<{ message: string }>("/api/signup", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        if (response.status === 200) {
          router.push("/auth/signin");
        } else {
          setError(response.data.message);
        }
      }

      setSuccess(true);

      setTimeout(() => {
        setForm({ name: "", email: "", password: "" });
        setSuccess(false);
      }, 2000);
    } catch (err) {
        console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-black px-8 py-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {isSignIn ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              {isSignIn
                ? "Sign in to continue to your account"
                : "Sign up to get started with us"}
            </p>
          </div>

          {/* Form Container */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field (Sign Up Only) */}
              {!isSignIn && (
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                      fieldErrors.name
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 focus:ring-gray-500"
                    }`}
                    required
                  />
                  {fieldErrors.name && (
                    <p className="text-red-600 text-sm mt-1">
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                    fieldErrors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-gray-500"
                  }`}
                  required
                />
                {fieldErrors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete={isSignIn ? "current-password" : "new-password"}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                    fieldErrors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-gray-500"
                  }`}
                  required
                />
                {fieldErrors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {fieldErrors.password}
                  </p>
                )}
                {!isSignIn && !fieldErrors.password && (
                  <p className="text-xs text-gray-500 mt-1">
                    Password must contain at least one letter, one number, and
                    one special character
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                onClick={() => handleSubmit}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {isSignIn ? "Signing in..." : "Creating account..."}
                    </span>
                  </div>
                ) : isSignIn ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-600 rounded-full flex-shrink-0"></div>
                    <p className="text-gray-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-white rounded-full flex-shrink-0"></div>
                    <p className="text-white text-sm">
                      {isSignIn
                        ? "Successfully signed in!"
                        : "Account created successfully!"}
                    </p>
                  </div>
                </div>
              )}
            </form>

            {/* Toggle Mode */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-3">
                  {isSignIn
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </p>
                <Link
                  href={isSignIn ? "/auth/signup" : "/auth/signin"}
                  className="text-gray-800 hover:text-black font-semibold text-sm transition-colors duration-200 hover:underline"
                >
                  {isSignIn ? "Create new account" : "Sign in instead"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-xs">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
