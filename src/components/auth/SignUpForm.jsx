import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";

// ── Success Modal ─────────────────────────────────────────────────────────────
function SuccessModal({ storeName, onContinue }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-2xl text-center animate-[fadeScaleIn_0.3s_ease_both]">
        {/* Animated checkmark circle */}
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
          <svg
            className="h-8 w-8 text-emerald-500 animate-[checkDraw_0.4s_ease_0.1s_both]"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
          You're registered!
        </h3>
        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {storeName}
          </span>{" "}
          has been created successfully.
        </p>
        <p className="mb-6 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-lg px-3 py-2">
          Your account is <strong>pending admin approval</strong>. Sign in to check your status.
        </p>

        <button
          onClick={onContinue}
          className="w-full rounded-xl bg-brand-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 active:scale-[0.98]"
        >
          Continue to Sign In →
        </button>
      </div>

      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes checkDraw {
          from { opacity: 0; transform: scale(0.5); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ── Main SignUpForm ───────────────────────────────────────────────────────────
export default function SignUpForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked]               = useState(false);
  const [showSuccess, setShowSuccess]           = useState(false);
  const [form, setForm] = useState({
    storeName: "", email: "", password: "", confirmPassword: "",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isChecked)
      return setError("You must agree to the Terms and Conditions");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/vendor/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // ✅ Show success popup instead of navigating immediately
      setShowSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Success modal */}
      {showSuccess && (
        <SuccessModal
          storeName={form.storeName}
          onContinue={() => navigate("/signin")}
        />
      )}

      <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
        <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
          <Link
            to="/signin"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Sign In
          </Link>
        </div>

        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          {/* Header */}
          <div className="mb-7">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/10">
              <svg className="h-6 w-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H8.25A2.25 2.25 0 006 13.5V21m10.5 0V8.25a2.25 2.25 0 00-2.25-2.25h-1.5A2.25 2.25 0 0010.5 8.25V21M3 21h18" />
              </svg>
            </div>
            <h1 className="mb-1.5 text-2xl font-bold text-gray-900 dark:text-white">
              Create Vendor Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Register your store — takes less than a minute.
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

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Store Name */}
              <div>
                <Label>
                  Store Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  name="storeName"
                  placeholder="e.g. myawesomestore"
                  value={form.storeName}
                  onChange={handleChange}
                  required
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Lowercase, no spaces. This will be your unique store identifier.
                </p>
              </div>

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
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Min. 6 characters"
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

              {/* Confirm Password */}
              <div>
                <Label>
                  Confirm Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 pt-1">
                <Checkbox
                  className="mt-0.5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  I agree to the{" "}
                  <span className="font-medium text-gray-800 dark:text-white/90 cursor-pointer hover:underline">
                    Terms and Conditions
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-gray-800 dark:text-white cursor-pointer hover:underline">
                    Privacy Policy
                  </span>
                </p>
              </div>

              {/* Submit */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                      </svg>
                      Creating account...
                    </>
                  ) : (
                    "Create Vendor Account"
                  )}
                </button>
              </div>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-semibold text-red-500 hover:text-brand-600 dark:text-brand-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}