"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../components/ui/toast";

interface FormData {
  email: string;
  password: string;
  // rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    // rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { show, Toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    try {
      const apiUrl = "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        show("Login successful!", "success");

        window.location.href = "/dashboard";
      } else {
        const data = await response.json().catch(() => ({}));
        setErrors({
          general: data?.message || "Login failed. Please try again.",
        });
        show(data?.message || "Login failed. Please try again.", "error");
      }
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." });
      show("An error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsGoogleLoading(true);
    setErrors({});
    try {
      // Simulate API call to verify Google token
      await new Promise((resolve) => setTimeout(resolve, 1500));
      show("Google login successful!", "success");
      // You can send credentialResponse.credential to your backend here
    } catch (error) {
      setErrors({ general: "Google login failed. Please try again." });
      show("Google login failed. Please try again.", "error");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ general: "Google login failed. Please try again." });
    show("Google login failed. Please try again.", "error");
  };

  return (
    <GoogleOAuthProvider clientId="your-google-client-id">
      <Toast />
      <div className="min-h-screen min-w-screen bg-[#32bb78] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            {errors.general && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {errors.general}
                </AlertDescription>
              </Alert>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`mt-1 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "focus:border-[#32bb78] focus:ring-[#32bb78]"
                  } text-gray-900`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pr-10 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "focus:border-[#32bb78] focus:ring-[#32bb78]"
                    } text-gray-900`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={true}
                    onCheckedChange={handleRememberMeChange}
                    className="data-[state=checked]:bg-[#32bb78] data-[state=checked]:border-[#32bb78]"
                  />
                  <Label htmlFor="remember-me" className="text-sm text-gray-50">
                    Remember me
                  </Label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-[#32bb78] hover:text-[#2a9d66] transition-colors"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#32bb78] hover:bg-[#2a9d66] text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#32bb78] focus:ring-offset-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="mt-6 w-full flex justify-center">
                  <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="outline"
                      size="large"
                      width="384"
                      text="continue_with"
                      shape="rectangular"
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {"Don't have an account? "}
                <a
                  href="/signup"
                  className="font-medium text-[#32bb78] hover:text-[#2a9d66] transition-colors"
                >
                  Sign up here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
