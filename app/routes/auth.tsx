import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useSupabaseAuthStore } from "../lib/supabase";
import type { Route } from "./+types/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "HireLens | Sign In" },
    { name: "description", content: "Log in to your account" },
  ];
}

const AuthPage = () => {
  const { auth, isLoading, error } = useSupabaseAuthStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    if (!email || !password) {
      setLocalError("Please enter both email and password");
      return;
    }

    try {
      await auth.signIn(email, password);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      setLocalError(msg);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
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
            <h1>Welcome back</h1>
            <h2>Sign in to continue reviewing resumes and reports.</h2>
          </div>

          {auth.isAuthenticated ? (
            <div>
              <p className="mb-4 text-sm text-slate-300">
                Logged in as: <strong>{auth.getUser()?.email}</strong>
              </p>
              <button
                onClick={handleLogout}
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

              <button
                type="submit"
                disabled={isLoading}
                className="auth-button disabled:opacity-50"
              >
                <p>{isLoading ? "Signing in..." : "Sign in"}</p>
              </button>

              <Link
                to="/signup"
                className="text-sm text-slate-400 hover:text-slate-300 text-center"
              >
                Don't have an account? Sign up
              </Link>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
