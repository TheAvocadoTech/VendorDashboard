import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const SiginInLogin = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("PHONE_INPUT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("https://api.minutos.in/api/vendor/send-otp", { phone });
      if (data.success) {
        setStep("OTP_INPUT");
        setTimer(60);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

const { login } = useAuth(); // ✅ add this

const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
    const { data } = await axios.post("https://api.minutos.in/api/vendor/verify-otp", { phone, otp });
    if (data.success) {
      login(data); // ✅ this sets vendor in context AND saves to localStorage
      navigate("/dashboard");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Invalid OTP");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="flex min-h-screen bg-white">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24">

        

        <div className="flex items-center gap-2 mb-10">
          <div className={`h-1.5 w-8 rounded-full ${step === 'PHONE_INPUT' ? 'bg-red-500' : 'bg-gray-200'}`}></div>
          <div className={`h-1.5 w-8 rounded-full ${step === 'OTP_INPUT' ? 'bg-red-500' : 'bg-gray-200'}`}></div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-500 mb-8">
          {step === "PHONE_INPUT" ? "Enter your registered phone to continue." : `Enter verification code sent to +91 ${phone}`}
        </p>

        {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}

        <form onSubmit={step === "PHONE_INPUT" ? handleRequestOtp : handleVerifyOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {step === "PHONE_INPUT" ? "Phone number" : "Verification Code"}
            </label>
            <div className="relative">
              {step === "PHONE_INPUT" && (
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">+91</span>
              )}
              <input
                type="tel"
                required
                maxLength={step === "PHONE_INPUT" ? 10 : 6}
                value={step === "PHONE_INPUT" ? phone : otp}
                onChange={(e) =>
                  step === "PHONE_INPUT"
                    ? setPhone(e.target.value.replace(/\D/g, ""))
                    : setOtp(e.target.value.replace(/\D/g, ""))
                }
                className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-red-500 focus:border-red-500 outline-none ${step === "PHONE_INPUT" ? "pl-12" : ""}`}
                placeholder={step === "PHONE_INPUT" ? "9876543210" : "000000"}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300 flex justify-center items-center"
          >
            {loading ? "Please wait..." : "Continue →"}
          </button>
        </form>

        {step === "OTP_INPUT" && (
          <div className="mt-6 text-center">
            {timer > 0 ? (
              <p className="text-sm text-gray-400">Resend code in {timer}s</p>
            ) : (
              <button onClick={handleRequestOtp} className="text-sm text-red-500 font-medium hover:underline">
                Resend OTP
              </button>
            )}
            <button
              onClick={() => { setStep("PHONE_INPUT"); setOtp(""); setError(""); }}
              className="block mx-auto mt-4 text-sm text-gray-400 hover:text-gray-600"
            >
              Change Phone Number
            </button>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-red-500 flex-col justify-center px-20 text-white relative">
  <div className="hidden lg:flex lg:w-1/2 bg-red-500 flex-col justify-center px-20 text-white relative">
  <div className="z-10">
    {/* Logo — white & large */}
    <img
      src="https://www.minutos.in/minitos.png"
      alt="Minutos Logo"
      className="w-56 mb-10 brightness-0 invert"
    />

    <h2 className="text-4xl font-bold mb-6">Welcome back to <br /> Vendor Dashboard</h2>
    <p className="text-red-100 text-lg mb-10">Enter your registered phone number to manage your inventory and orders instantly.</p>
    <ul className="space-y-4">
      <li className="flex items-center gap-3"><span className="bg-white/20 p-1 rounded-full text-xs">✓</span> Instant OTP verification</li>
      <li className="flex items-center gap-3"><span className="bg-white/20 p-1 rounded-full text-xs">✓</span> Real-time order tracking</li>
      <li className="flex items-center gap-3"><span className="bg-white/20 p-1 rounded-full text-xs">✓</span> Secure vendor panel</li>
    </ul>
  </div>
</div>
</div>
    </div>
  );
};

export default SiginInLogin;