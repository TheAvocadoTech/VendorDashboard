import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

// ─────────────────────────────────────────────────────────────────────────────
// API helper
// ─────────────────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL;

const post = async (path, body, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI
// ─────────────────────────────────────────────────────────────────────────────
function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400">
      <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      {message}
    </div>
  );
}

function SubmitButton({ loading, label, loadingLabel, disabled }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
          </svg>
          {loadingLabel}
        </>
      ) : label}
    </button>
  );
}

function StepIcon({ children }) {
  return (
    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10">
      {children}
    </div>
  );
}

// Progress bar
function ProgressBar({ step, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-500 ${
            i < step
              ? "w-8 bg-emerald-400"
              : i === step
              ? "w-8 bg-red-500"
              : "w-4 bg-gray-200 dark:bg-gray-700"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-400">Step {step + 1} of {total}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Enter Email
// ─────────────────────────────────────────────────────────────────────────────
function StepEmail({ onNext }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send OTP to email
      await post("/vendor/send-otp", { email });
      onNext(email);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-[slideIn_0.2s_ease_both]">
      <StepIcon>
        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      </StepIcon>

      <h1 className="mb-1.5 text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
      <p className="mb-7 text-sm text-gray-500 dark:text-gray-400">
        Enter your registered email to continue.
      </p>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourstore.com"
            autoFocus
            required
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 dark:focus:border-red-500 dark:focus:ring-red-500/20"
          />
        </div>
        <SubmitButton loading={loading} label="Continue →" loadingLabel="Sending code..." />
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Verify OTP
// ─────────────────────────────────────────────────────────────────────────────
const RESEND_SECONDS = 60;

function StepOtp({ email, onNext, onBack }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const otp = digits.join("");

  const handleDigit = (i, val) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (otp.length < 6) return setError("Please enter the complete 6-digit code");

    setLoading(true);
    try {
      const data = await post("/vendor/verify-otp", { email, otp });
      // data = { needsPassword: true, setupToken } OR { needsPassword: false, token, vendor }
      onNext(data);
    } catch (err) {
      setError(err.message);
      setDigits(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResending(true);
    try {
      await post("/vendor/send-otp", { email });
      setCountdown(RESEND_SECONDS);
      setDigits(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="animate-[slideIn_0.2s_ease_both]">
      <StepIcon>
        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      </StepIcon>

      <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">Check your inbox</h1>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">We sent a 6-digit code to</p>
      <p className="mb-7 text-sm font-semibold text-gray-800 dark:text-gray-200">{email}</p>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit}>
        <div className="mb-6 flex gap-2 justify-between" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              autoFocus={i === 0}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`h-14 w-full max-w-[52px] rounded-xl border-2 text-center text-xl font-bold outline-none transition-all
                ${d
                  ? "border-red-400 bg-red-50 text-red-600 dark:border-red-500 dark:bg-red-500/10 dark:text-red-400"
                  : "border-gray-200 bg-white text-gray-900 focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                }`}
            />
          ))}
        </div>

        <SubmitButton
          loading={loading}
          label="Verify Code →"
          loadingLabel="Verifying..."
          disabled={otp.length < 6}
        />
      </form>

      <div className="mt-5 flex flex-col items-center gap-2 text-sm text-gray-500">
        {countdown > 0 ? (
          <p>Resend code in <span className="font-semibold text-gray-700 dark:text-gray-300">{countdown}s</span></p>
        ) : (
          <button 
            type="button"
            onClick={handleResend} 
            disabled={resending} 
            className="font-semibold text-red-500 hover:text-red-600 disabled:opacity-60"
          >
            {resending ? "Resending..." : "Resend code"}
          </button>
        )}
        <button 
          type="button"
          onClick={onBack} 
          className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
        >
          Use a different email
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — Create Password (first-time vendors only)
// ─────────────────────────────────────────────────────────────────────────────
function StepCreatePassword({ setupToken, onSuccess }) {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      console.log("Creating password with token:", setupToken);
      
      const data = await post("/vendor/set-password", {
        password: form.password,
        confirmPassword: form.confirmPassword
      }, setupToken);

      console.log("Password creation response:", data);

      // Store the token and vendor info
      if (data.token && data.vendor) {
        localStorage.setItem("vendorToken", data.token);
        localStorage.setItem("vendorInfo", JSON.stringify(data.vendor));
        console.log("Token and vendor info stored successfully");
        onSuccess(); // This will navigate to dashboard
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Password creation error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-[slideIn_0.2s_ease_both]">
      <StepIcon>
        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </StepIcon>

      <h1 className="mb-1.5 text-2xl font-bold text-gray-900 dark:text-white">Create your password</h1>
      <p className="mb-7 text-sm text-gray-500 dark:text-gray-400">
        Choose a strong password for your account.
      </p>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Confirm password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        <SubmitButton
          loading={loading}
          label="Create Password & Sign In →"
          loadingLabel="Creating..."
        />
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 — Registration Success Screen
// ─────────────────────────────────────────────────────────────────────────────
function StepSuccess({ email, onContinue }) {
  return (
    <div className="animate-[slideIn_0.2s_ease_both] text-center">
      {/* Animated checkmark */}
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15 animate-[popIn_0.4s_ease_both]">
        <svg className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        You're registered! 🎉
      </h1>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        Your account for
      </p>
      <p className="mb-6 text-sm font-semibold text-gray-800 dark:text-gray-200">{email}</p>

      <div className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
        ⏳ Your account is <strong>pending admin approval</strong>. You can sign in now and check your status.
      </div>

      <button
        onClick={onContinue}
        className="w-full rounded-xl bg-red-500 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-[0.98]"
      >
        Continue to Sign In →
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 — Login with Email + Password
// ─────────────────────────────────────────────────────────────────────────────
function StepLogin({ prefillEmail, onSuccess }) {
  const [email, setEmail] = useState(prefillEmail || "");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await post("/vendor/login", { email, password });
      localStorage.setItem("vendorToken", data.token);
      localStorage.setItem("vendorInfo", JSON.stringify(data.vendor));
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-[slideIn_0.2s_ease_both]">
      <StepIcon>
        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
      </StepIcon>

      <h1 className="mb-1.5 text-2xl font-bold text-gray-900 dark:text-white">Sign in</h1>
      <p className="mb-7 text-sm text-gray-500 dark:text-gray-400">
        Enter your credentials to access your dashboard.
      </p>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourstore.com"
            required
            autoFocus={!prefillEmail}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoFocus={!!prefillEmail}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-16 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
            <button 
              type="button" 
              onClick={() => setShowPw(!showPw)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 hover:text-gray-600"
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <SubmitButton loading={loading} label="Sign In to Dashboard →" loadingLabel="Signing in..." />
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — Orchestrates all steps
// ─────────────────────────────────────────────────────────────────────────────
// Steps:
//  "email"           → enter email (check + send OTP)
//  "otp"             → verify OTP
//  "create-password" → first-time: create password
//  "success"         → registered! screen
//  "login"           → email + password login form
// ─────────────────────────────────────────────────────────────────────────────
export default function SignInForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [setupToken, setSetupToken] = useState("");

  // After OTP verified — two branches
  const handleOtpVerified = (data) => {
    console.log("OTP verified response:", data);
    
    if (data.needsPassword) {
      // First time — must create a password
      setSetupToken(data.setupToken);
      setStep("create-password");
    } else {
      // Already has password — go straight to login page
      setStep("login");
    }
  };

  // After password created — go to dashboard
  const handlePasswordCreated = () => {
    console.log("Password created, navigating to dashboard...");
    console.log("Stored token:", localStorage.getItem("vendorToken"));
    
    // Verify token exists before navigating
    const token = localStorage.getItem("vendorToken");
    if (token) {
      // Use replace to prevent going back to the form
      navigate("/dashboard", { replace: true });
    } else {
      console.error("No token found after password creation");
      // If no token, go to login instead
      setStep("login");
    }
  };

  // After login — go to dashboard
  const handleLoggedIn = () => {
    console.log("Logged in, navigating to dashboard...");
    navigate("/dashboard", { replace: true });
  };

  // Progress step index for bar (0-based)
  const stepIndex = {
    "email": 0,
    "otp": 1,
    "create-password": 2,
    "success": 3,
    "login": 3,
  };

  // Don't show progress bar on success / login screens
  const showProgress = !["success", "login"].includes(step);

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-4 py-10">

        {showProgress && (
          <ProgressBar step={stepIndex[step]} total={4} />
        )}

        {step === "email" && (
          <StepEmail
            onNext={(email) => { 
              console.log("Email submitted:", email);
              setEmail(email); 
              setStep("otp"); 
            }}
          />
        )}

        {step === "otp" && (
          <StepOtp
            email={email}
            onNext={handleOtpVerified}
            onBack={() => { 
              setStep("email"); 
              setEmail(""); 
            }}
          />
        )}

        {step === "create-password" && (
          <StepCreatePassword
            setupToken={setupToken}
            onSuccess={handlePasswordCreated}
          />
        )}

        {step === "success" && (
          <StepSuccess
            email={email}
            onContinue={() => setStep("login")}
          />
        )}

        {step === "login" && (
          <StepLogin
            prefillEmail={email}
            onSuccess={handleLoggedIn}
          />
        )}

      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}