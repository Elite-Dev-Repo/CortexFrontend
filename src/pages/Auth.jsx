import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Mail01Icon,
  LockKeyIcon,
  User02Icon,
  ArrowRight01Icon,
  ShieldKeyIcon,
  ViewIcon,
  ViewOffIcon,
  RefreshIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { Blocks } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/errors";
import { Field, Input } from "@/components/ui/app-modal";

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
    setShowPassword(false);
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

  const title = isVerifyMode
    ? "Verify your email"
    : mode === MODES.LOGIN
      ? "Welcome back"
      : "Create your account";

  const description = isVerifyMode
    ? "We've sent a 6-digit code to your inbox"
    : mode === MODES.LOGIN
      ? "Sign in to continue building with Cortex"
      : "Join Cortex and start shipping faster";

  const headerIcon = isVerifyMode ? (
    <HugeiconsIcon icon={ShieldKeyIcon} size={16} />
  ) : mode === MODES.LOGIN ? (
    <HugeiconsIcon icon={SparklesIcon} size={16} />
  ) : (
    <HugeiconsIcon icon={User02Icon} size={16} />
  );

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center px-4 py-8 sm:py-10 relative overflow-hidden">
      {/* subtle background - matches app-modal / dashboard palette */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-secondary/[0.04] blur-[80px]" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-primary/25 blur-[90px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2e2e2e07_1px,transparent_1px),linear-gradient(to_bottom,#2e2e2e07_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* top brand */}
      <Link
        to="/"
        className="inline-flex items-center gap-2.5 mb-6 sm:mb-8 text-secondary hover:opacity-80 transition-opacity"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary border border-secondary/10">
          <Blocks size={16} />
        </span>
        <span className="text-[15px] font-semibold tracking-tight">Cortex</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px]"
      >
        {/* card - same language as AppModal */}
        <div className="bg-white border border-secondary/10 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.14)] overflow-hidden">
          {/* header like AppModal header */}
          <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-secondary/8 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary border border-secondary/10">
              {headerIcon}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[15px] font-semibold tracking-tight text-secondary leading-5">
                {title}
              </h1>
              <p className="text-xs leading-4 text-secondary/55 mt-0.5">
                {description}
              </p>
            </div>
            <Link
              to="/"
              className="hidden sm:inline-flex shrink-0 h-8 px-3 items-center justify-center rounded-lg text-xs font-medium text-secondary/60 hover:text-secondary hover:bg-secondary/5 border border-transparent hover:border-secondary/10 transition-colors"
            >
              Back to site
            </Link>
          </div>

          {/* content */}
          <div className="p-5 sm:p-6">
            {/* segmented tabs - only when not verify */}
            {!isVerifyMode && (
              <div className="flex bg-background border border-secondary/8 rounded-lg p-1 mb-6">
                <button
                  type="button"
                  onClick={() => switchMode(MODES.LOGIN)}
                  className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-all ${
                    mode === MODES.LOGIN
                      ? "bg-secondary text-white shadow-sm"
                      : "text-secondary/50 hover:text-secondary"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode(MODES.SIGNUP)}
                  className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-all ${
                    mode === MODES.SIGNUP
                      ? "bg-secondary text-white shadow-sm"
                      : "text-secondary/50 hover:text-secondary"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {!isVerifyMode ? (
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, x: mode === MODES.LOGIN ? -8 : 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === MODES.LOGIN ? 8 : -8 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                  noValidate
                >
                  {mode === MODES.SIGNUP && (
                    <Field label="Username" required>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30 pointer-events-none">
                          <HugeiconsIcon icon={User02Icon} size={16} />
                        </span>
                        <Input
                          type="text"
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                          placeholder="johndoe"
                          autoComplete="username"
                          className="pl-10"
                          required
                        />
                      </div>
                    </Field>
                  )}

                  <Field label="Email" required>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30 pointer-events-none">
                        <HugeiconsIcon icon={Mail01Icon} size={16} />
                      </span>
                      <Input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </Field>

                  <Field
                    label="Password"
                    required
                    hint={mode === MODES.SIGNUP ? "Min. 8 characters" : undefined}
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30 pointer-events-none">
                        <HugeiconsIcon icon={LockKeyIcon} size={16} />
                      </span>
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        autoComplete={
                          mode === MODES.LOGIN ? "current-password" : "new-password"
                        }
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md text-secondary/40 hover:text-secondary hover:bg-secondary/5 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <HugeiconsIcon
                          icon={showPassword ? ViewOffIcon : ViewIcon}
                          size={16}
                        />
                      </button>
                    </div>
                  </Field>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-secondary text-white font-semibold py-2.5 rounded-lg text-[13px] flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {mode === MODES.LOGIN ? "Sign In" : "Create Account"}
                        <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs leading-4 text-secondary/50 pt-1">
                    {mode === MODES.LOGIN ? (
                      <>
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => switchMode(MODES.SIGNUP)}
                          className="font-medium text-secondary hover:underline underline-offset-4"
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
                          className="font-medium text-secondary hover:underline underline-offset-4"
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
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  <div className="rounded-lg bg-background border border-secondary/8 px-4 py-3 flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white border border-secondary/10 text-secondary">
                      <HugeiconsIcon icon={Mail01Icon} size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-secondary leading-4">
                        Code sent to
                      </p>
                      <p className="text-[13px] font-semibold text-secondary truncate">
                        {form.email || "your email"}
                      </p>
                      <p className="text-[11px] text-secondary/50 mt-0.5">
                        Enter the 6-digit code to verify your account. Check spam if needed.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <Field label="Verification Code" required hint="6 digits">
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={otp}
                        onChange={handleOtpChange}
                        placeholder="• • • • • •"
                        maxLength={6}
                        className="text-center text-[18px] tracking-[0.45em] font-mono py-3 placeholder:tracking-[0.45em]"
                        autoComplete="one-time-code"
                      />
                    </Field>

                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full bg-secondary text-white font-semibold py-2.5 rounded-lg text-[13px] flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Verify Email
                          <HugeiconsIcon icon={ShieldKeyIcon} size={16} />
                        </>
                      )}
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="w-full bg-white border border-secondary/10 text-secondary/70 hover:text-secondary hover:border-secondary/20 hover:bg-secondary/5 py-2.5 rounded-lg text-[13px] font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resending ? (
                      <span className="w-4 h-4 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
                    ) : (
                      <>
                        <HugeiconsIcon icon={RefreshIcon} size={14} />
                        Resend Code
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-secondary/50">
                    <button
                      type="button"
                      onClick={() => switchMode(MODES.LOGIN)}
                      className="font-medium text-secondary hover:underline underline-offset-4"
                    >
                      Back to sign in
                    </button>
                    <span className="mx-2 text-secondary/20">•</span>
                    <button
                      type="button"
                      onClick={() => switchMode(MODES.SIGNUP)}
                      className="text-secondary/60 hover:text-secondary hover:underline underline-offset-4"
                    >
                      Change email
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
