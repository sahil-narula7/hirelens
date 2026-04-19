import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useSupabaseAuthStore } from "../lib/supabase";
import type { Route } from "./+types/signup";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "HireLens | Sign Up" },
    { name: "description", content: "Create a new account" },
  ];
}

const SignUpPage = () => {
  const { auth, isLoading, error } = useSupabaseAuthStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string>("");

  useEffect(() => {
    if (auth.isAuthenticated && next) {
      navigate(next);
    } else if (auth.isAuthenticated) {
      navigate("/");
    }
  }, [auth.isAuthenticated, next, navigate]);

  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    const timeout = window.setTimeout(resetScroll, 80);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password || !confirmPassword) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    try {
      await auth.signUp(email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign up failed";
      setLocalError(msg);
    }
  };

  const displayError = error || localError;

  return (
    <div className="flex min-h-[100dvh] items-start justify-center px-4 pt-4 pb-8 sm:pt-6">
      <div className="section-card w-full max-w-xl p-8 sm:p-10">
        <section className="flex flex-col gap-8">
          <div className="flex flex-col items-start gap-3 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Secure access
            </p>
            <h1>Welcome</h1>
            <h2>Create an account to start analyzing resumes.</h2>
          </div>

          {auth.isAuthenticated ? (
            <div>
              <p className="mb-4 text-sm text-slate-300">
                Logged in as: <strong>{auth.getUser()?.email}</strong>
              </p>
              <button
                onClick={() => auth.signOut()}
                disabled={isLoading}
                className="auth-button disabled:opacity-50"
              >
                <p>{isLoading ? "Logging out..." : "Log out"}</p>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {displayError && (
                <div className="rounded bg-red-500/20 p-3 text-sm text-red-300">
                  {displayError}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className="w-full rounded bg-slate-700 px-4 py-2 text-slate-100 placeholder-slate-400 disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full rounded bg-slate-700 px-4 py-2 text-slate-100 placeholder-slate-400 disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full rounded bg-slate-700 px-4 py-2 text-slate-100 placeholder-slate-400 disabled:opacity-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="auth-button disabled:opacity-50"
              >
                <p>{isLoading ? "Creating account..." : "Create account"}</p>
              </button>

              <Link
                to="/auth"
                className="text-sm text-slate-400 hover:text-slate-300 text-center"
              >
                Already have an account? Sign in
              </Link>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default SignUpPage;
