import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "../lib/puter";
import type { Route } from "./+types/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "HireLens | Authentication" },
    { name: "description", content: "Log in to your account" },
  ];
}

const AuthPage = () => {
  const { auth, isLoading } = usePuterStore();
  const location = useLocation();
  const next = location.search.split("next=")[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated && next) {
      navigate(next);
    }
  }, [auth.isAuthenticated, next]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing you in...</p>
              </button>
            ) : auth.isAuthenticated ? (
              <button className="auth-button" onClick={auth.signOut}>
                <p>Log out</p>
              </button>
            ) : (
              <button className="auth-button" onClick={auth.signIn}>
                <p>Log in</p>
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AuthPage;
