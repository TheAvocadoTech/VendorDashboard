import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useAuth } from "../../context/AuthContext";

export default function SignInForm() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [form, setForm]   = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/vendor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      login(data);      // saves vendor + token to context & localStorage
      navigate("/");    // go to dashboard
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Top back link */}
      <div className="w-full max-w-md pt-10 mx-auto">
        
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="mb-7">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">
            <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3" />
            </svg>
          </div>
          <h1 className="mb-1.5 text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign in to your vendor dashboard
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-400">
            <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {error}
          </div>
        )}

        {/* Pending status notice — shown if user was rejected or pending */}
        {error?.toLowerCase().includes("pending") && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400">
            Your account is awaiting admin approval. Please check back later.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Email */}
            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                name="email"
                placeholder="you@yourstore.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="mb-0">
                  Password <span className="text-error-500">*</span>
                </Label>
                <Link
                  to="/reset-password"
                  className="text-xs font-medium text-red-400 hover:text-red-500 dark:text-red-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Keep logged in */}
            <div className="flex items-center gap-3">
              <Checkbox checked={keepLoggedIn} onChange={setKeepLoggedIn} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Keep me logged in
              </span>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <Button
                className="w-full"
                size="sm"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in to Dashboard"
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
          <span className="text-xs text-gray-400">New vendor?</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Register CTA */}
        <Link
          to="/signup"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:border-gray-300 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H8.25A2.25 2.25 0 006 13.5V21m10.5 0V8.25a2.25 2.25 0 00-2.25-2.25h-1.5A2.25 2.25 0 0010.5 8.25V21M3 21h18" />
          </svg>
          Create a vendor account
        </Link>
      </div>
    </div>
  );
}