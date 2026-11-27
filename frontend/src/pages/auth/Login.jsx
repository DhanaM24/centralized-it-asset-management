import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Package, Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Top banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-center">

            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30">
                <Package size={36} className="text-white" />
              </div>
            </div>

            {/* System name */}
            <h1 className="text-white text-xl font-bold tracking-wide">
              IT Asset Management
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              Centralized Management System
            </p>
          </div>

          {/* Form section */}
          <div className="px-8 py-8">

            <div className="mb-6">
              <h2 className="text-slate-800 text-xl font-semibold">
                Welcome back
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Email Address
                </label>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Mail size={18} />
                  </span>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@company.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm
                               text-slate-800 placeholder-slate-400 bg-slate-50
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               focus:bg-white transition"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 mb-1.5"
                >
                  Password
                </label>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </span>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-lg text-sm
                               text-slate-800 placeholder-slate-400 bg-slate-50
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               focus:bg-white transition"
                    autoComplete="current-password"
                  />

                  {/* Show / hide toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400
                               hover:text-slate-600 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400
                           text-white font-semibold py-3 rounded-lg text-sm
                           flex items-center justify-center gap-2
                           transition-all duration-200 shadow-md hover:shadow-lg
                           disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
              © 2026 Centralized IT Asset Management System. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;

