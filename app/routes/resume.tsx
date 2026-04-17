import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/feebdack/ATS";
import Details from "~/components/feebdack/Details";
import Summary from "~/components/feebdack/Summary";
import { usePuterStore } from "~/lib/puter";
import type { Route } from "./+types/resume";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "HireLens | Resume Review" },
    { name: "description", content: "A detailed overview of your resume" },
  ];
}

const ResumePage = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [resumeData, setResumeData] = useState<Resume | null>(null);
  const { auth, isLoading, fs, kv } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;
      const data = JSON.parse(resume);
      setResumeData(data);
      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;
      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);
      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageUrl);
      setFeedback(data.feedback);
    };
    loadResume();
  }, [id]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-sm font-semibold text-slate-200">
            Back to dashboard
          </span>
        </Link>
      </nav>
      <div className="page-shell">
        <div className="grid grid-cols-1 gap-6 xl:gap-8 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.35fr)]">
          <section className="feedback-section self-start lg:sticky lg:top-24">
            <div className="section-card overflow-hidden p-4 sm:p-5">
              {imageUrl && resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-xl border border-slate-700 bg-slate-950"
                >
                  <img
                    src={imageUrl}
                    className="h-auto max-h-[78vh] w-full rounded-xl object-contain"
                    title="resume"
                    alt="Resume preview"
                  />
                </a>
              )}
            </div>
          </section>
          <section className="feedback-section min-w-0">
            <div className="section-card p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Review report
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-100">
                Resume Review
              </h2>
              {resumeData && (
                <p className="mt-2 text-sm text-slate-400">
                  {resumeData.companyName || "Target company not specified"}
                  {resumeData.jobTitle ? ` · ${resumeData.jobTitle}` : ""}
                </p>
              )}
            </div>

            {feedback ? (
              <div className="mt-4 flex min-w-0 flex-col gap-6 animate-in fade-in duration-1000 sm:mt-6">
                <Summary feedback={feedback} />
                <ATS
                  score={feedback.ATS.score || 0}
                  suggestions={feedback.ATS.tips || []}
                />
                <Details feedback={feedback} />
              </div>
            ) : (
              <div className="section-card mt-4 flex w-full flex-col items-center justify-center p-8 sm:mt-6 sm:p-10">
                <img
                  src="/images/resume-scan-2.gif"
                  className="w-[160px] opacity-80"
                />
                <p className="mt-4 text-sm text-slate-400">
                  Loading the review report...
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ResumePage;
