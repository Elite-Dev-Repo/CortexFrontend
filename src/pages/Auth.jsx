import { useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";

const MODES = {
  LOGIN: "login",
  SIGNUP: "signup",
  VERIFY: "verify",
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 8;

const Auth = () => {
  const navigate = useNavigate();
  const { login, register, verifyEmail, resendOtp } = useAuth();

  const [mode, setMode] = useState(MODES.LOGIN);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [otp, setOtp] = useState("");

  const resetForm = () => {
    setForm({ username: "", email: "", password: "" });
    setOtp("");
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\s/g, "");
    if (val.length <= 6) setOtp(val);
  };

  const handleLogin = async () => {
    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!form.password) {
      toast.error("Password is required.");
      return;
    }
    await login(form.email, form.password);
    toast.success("Welcome back!");
    navigate("/dashboard");
  };

  const handleRegister = async () => {
    if (!form.username.trim() || form.username.trim().length < 3) {
      toast.error("Username must be at least 3 characters.");
      return;
    }
    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!validatePassword(form.password)) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    await register(form.username.trim(), form.email.trim(), form.password);
    toast.success("Verification code sent to your email.");
    setMode(MODES.VERIFY);
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Enter the 6-digit verification code.");
      return;
    }
    await verifyEmail(otp);
    toast.success("Email verified! Sign in to continue.");
    switchMode(MODES.LOGIN);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === MODES.LOGIN) await handleLogin();
      else if (mode === MODES.SIGNUP) await handleRegister();
      else await handleVerify();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Verify mode uses onClick via handleSubmit; keep form submit handling unified
  const handleResendOtp = async () => {
    if (!validateEmail(form.email)) {
      toast.error("Missing email for resending code.");
      return;
    }
    setResending(true);
    try {
      await resendOtp(form.email.trim());
      toast.success("New code sent to your email.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to resend code. Try again."));
    } finally {
      setResending(false);
    }
  };

  const isVerifyMode = mode === MODES.VERIFY;

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
            <span className="text-xl tracking-wider ">Cortex</span>
          </div>

          <div className="flex bg-background rounded-lg p-1 mb-8">
            <button
              type="button"
              onClick={() => switchMode(MODES.LOGIN)}
              className={`flex-1 py-2 text-sm rounded-md transition-all ${mode === MODES.LOGIN ? "bg-white text-background font-semibold" : "text-white/60 hover:text-white"}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode(MODES.SIGNUP)}
              className={`flex-1 py-2 text-sm rounded-md transition-all ${mode === MODES.SIGNUP ? "bg-white text-background font-semibold" : "text-white/60 hover:text-white"}`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!isVerifyMode ? (
              <motion.form
                key={mode}
                initial={{ opacity: 0, x: mode === MODES.LOGIN ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === MODES.LOGIN ? 20 : -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-4"
                noValidate
              >
                {mode === MODES.SIGNUP && (
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
                        autoComplete="username"
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
                      autoComplete="email"
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
                      autoComplete={
                        mode === MODES.LOGIN
                          ? "current-password"
                          : "new-password"
                      }
                      className="w-full bg-background border border-white/10 rounded-lg py-2.5 pl-10 pr-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black/80 hover:text-black/60"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
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
                      {mode === MODES.LOGIN ? "Sign In" : "Create Account"}
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-white/40">
                  {mode === MODES.LOGIN ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode(MODES.SIGNUP)}
                        className="text-white hover:underline"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode(MODES.LOGIN)}
                        className="text-white hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  )}
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

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label className="text-sm text-white/60 mb-1.5 block">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full bg-background border border-white/10 rounded-lg py-3 text-center text-xl tracking-[0.5em] text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all font-mono"
                      autoComplete="one-time-code"
                    />
                  </div>

                  <button
                    type="submit"
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
                </form>

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
                    onClick={() => switchMode(MODES.LOGIN)}
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
