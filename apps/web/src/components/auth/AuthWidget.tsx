"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Sparkles, BrainCircuit, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface AuthWidgetProps {
  view: "sign_in" | "sign_up" | "forgotten_password";
  title: string;
}

export function AuthWidget({ view, title }: AuthWidgetProps) {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoading(false);
      if (session) {
        router.push("/dashboard");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setActionLoading(true);

    try {
      if (view === "sign_in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else if (view === "sign_up") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });
        if (error) throw error;
        if (data?.user && !data?.session) {
          setSuccessMessage("Success! Please check your email to confirm your account.");
        } else {
          router.push("/dashboard");
        }
      } else if (view === "forgotten_password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/dashboard`,
        });
        if (error) throw error;
        setSuccessMessage("Password reset link sent! Check your inbox.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setActionLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google.");
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <BrainCircuit className="w-12 h-12 text-primary animate-pulse" />
        <p className="text-muted-foreground font-mono text-sm">Loading Irshaad AI...</p>
      </div>
    );
  }

  const submitText =
    view === "sign_in"
      ? "Sign In"
      : view === "sign_up"
        ? "Create Account"
        : "Send Reset Link";

  return (
    <div className="z-10 w-full max-w-md flex flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="auth-card"
      >
        <h2 className="text-xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> {title}
        </h2>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Social Sign In (Only for sign_in/sign_up) */}
        {view !== "forgotten_password" && (
          <>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={actionLoading}
              className="auth-btn-google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center my-6">
              <div className="auth-divider-line" />
              <span className="auth-divider-text">Or continue with</span>
              <div className="auth-divider-line" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="auth-input"
            />
          </div>

          {/* Password input (Only for sign_in/sign_up) */}
          {view !== "forgotten_password" && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                {view === "sign_in" && (
                  <Link
                    href="/forgot-password"
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="auth-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={actionLoading}
            className="auth-btn-submit mt-6"
          >
            {actionLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>{submitText}</span>
            )}
          </button>
        </form>

        {/* Footer Toggle links */}
        <div className="mt-6 text-center text-sm text-slate-400">
          {view === "sign_in" ? (
            <span>
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-primary hover:underline font-bold transition-all">
                Sign Up
              </Link>
            </span>
          ) : view === "sign_up" ? (
            <span>
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-bold transition-all">
                Log In
              </Link>
            </span>
          ) : (
            <Link href="/login" className="text-primary hover:underline font-bold transition-all">
              Go back to Log In
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
