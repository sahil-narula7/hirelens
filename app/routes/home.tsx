import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import Navbar from "../components/Navbar";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "HireLens" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => {
        const data = JSON.parse(resume.value);
        return data as Resume;
      });
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, []);

  return (
    <main>
      <div className="page-shell">
        <Navbar />
        <section className="main-section">
          <div className="section-card w-full p-8 text-left">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Dashboard
                </p>
                <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.03em] text-slate-50 md:text-5xl">
                  Professional resume review dashboard
                </h1>
                {!loadingResumes && resumes.length === 0 ? (
                  <h2>
                    Upload a resume to generate a professional ATS and hiring
                    feedback report.
                  </h2>
                ) : (
                  <h2>
                    Review your latest submissions, compare scores, and open
                    full feedback reports.
                  </h2>
                )}
              </div>
              <Link to="/upload" className="primary-button w-fit">
                Upload Resume
              </Link>
            </div>
          </div>

          {loadingResumes && (
            <div className="section-card flex w-full flex-col items-center justify-center p-10">
              <img
                src="/images/resume-scan-2.gif"
                className="w-[160px] opacity-80"
              />
              <p className="mt-4 text-sm text-slate-400">
                Loading your saved reviews...
              </p>
            </div>
          )}

          {resumes.length > 0 && !loadingResumes && (
            <div className="resumes-section">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}

          {!loadingResumes && resumes.length === 0 && (
            <div className="section-card flex w-full flex-col items-center justify-center gap-4 p-10 text-center">
              <p className="text-lg font-medium text-slate-100">
                No resumes have been reviewed yet.
              </p>
              <p className="max-w-xl text-sm text-slate-400">
                Start with a PDF upload and the app will prepare the review,
                store it securely, and show the feedback in a structured format.
              </p>
              <Link to="/upload" className="primary-button w-fit">
                Start New Review
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
