import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Blocks,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { login, register, verifyEmail, resendOtp } from "@/lib/authApi";

const Auth = () => {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setForm({ username: "", email: "", password: "" });
    setOtp("");
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\s/g, "");
    if (val.length <= 6) setOtp(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else if (mode === "signup") {
        await register(form.username, form.email, form.password);
        toast.success("Verification code sent to your email.");
        setMode("verify");
      } else {
        await verifyEmail(otp);
        toast.success("Email verified! Sign in to continue.");
        setMode("login");
        setOtp("");
        setForm({ username: "", email: "", password: "" });
      }
    } catch (err) {
      if (!err.response) {
        toast.error("server unavailable.");
      } else {
        const message =
          err.response?.data?.detail ||
          err.response?.data?.email?.[0] ||
          err.response?.data?.username?.[0] ||
          err.response?.data?.password?.[0] ||
          err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.error?.[0] ||
          err.response?.data?.error ||
          "Something went wrong. Please try again.";
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      await resendOtp(form.email);
      toast.success("New code sent to your email.");
    } catch (err) {
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Failed to resend code. Try again.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="bg-background w-full min-h-screen text-white flex items-center justify-center overflow-hidden relative px-4">
      <div className="absolute w-60 h-60 md:w-100 md:h-100 bg-white/5 rounded-full top-0 right-0 blur-3xl pointer-events-none" />
      <div className="absolute w-60 h-60 md:w-80 md:h-80 bg-white/5 rounded-full bottom-0 left-0 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto z-10"
      >
        <div className="bg-foreground/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
          <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
            <Blocks size={24} className="text-white" />
            <span className="text-xl tracking-wider font-light">Cortex</span>
          </div>

          <div className="flex bg-background rounded-lg p-1 mb-8">
            <button
              onClick={() => {
                setMode("login");
                setForm({ username: "", email: "", password: "" });
              }}
              className={`flex-1 py-2 text-sm rounded-md transition-all ${mode === "login" ? "bg-white text-background font-semibold" : "text-white/60 hover:text-white"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setForm({ username: "", email: "", password: "" });
              }}
              className={`flex-1 py-2 text-sm rounded-md transition-all ${mode === "signup" ? "bg-white text-background font-semibold" : "text-white/60 hover:text-white"}`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode !== "verify" ? (
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === "signup" && (
                <div>
                  <label className="text-sm text-white/60 mb-1.5 block">
                    Username
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder="johndoe"
                      className="w-full bg-background border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm text-white/60 mb-1.5 block">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-background border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-background border border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-background font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-white/40">
                {mode === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-white hover:underline"
                    >
                      Sign up
                    </button>
                  </>
                ) : mode === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="text-white hover:underline"
                    >
                      Sign in
                    </button>
                  </>
                ) : null}
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <ShieldCheck size={40} className="mx-auto text-white/80" />
                <h3 className="text-lg font-semibold">Verify your email</h3>
                <p className="text-sm text-white/50">
                  Enter the 6-digit code sent to{" "}
                  <span className="text-white/80">{form.email}</span>
                </p>
              </div>

              <div>
                <label className="text-sm text-white/60 mb-1.5 block">
                  Verification Code
                </label>
                <input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full bg-background border border-white/10 rounded-lg py-3 text-center text-xl tracking-[0.5em] text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all font-mono"
                  autoComplete="one-time-code"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || otp.length !== 6}
                className="w-full bg-white text-background font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Verify Email
                    <ShieldCheck size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="w-full bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/30 py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resending ? (
                  <span className="w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <RefreshCw size={14} />
                    Resend Code
                  </>
                )}
              </button>

              <p className="text-center text-sm text-white/40">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setOtp("");
                  }}
                  className="text-white hover:underline"
                >
                  Back to sign in
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  </div>
  );
};

export default Auth;
