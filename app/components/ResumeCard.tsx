import { useEffect, useState } from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import ScoreCircle from "./ScoreCircle";

const ResumeCard = ({ resume }: { resume: Resume }) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(resume.imagePath);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };
    loadResume();
    setScore(resume.feedback.overallScore);
  }, [resume.imagePath]);
  return (
    <Link
      to={`/resume/${resume.id}`}
      className="resume-card group animate-in fade-in duration-1000"
    >
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          {resume.companyName && (
            <h2 className="!text-slate-100 text-2xl font-semibold break-words">
              {resume.companyName}
            </h2>
          )}
          {resume.jobTitle && (
            <h3 className="text-sm font-medium break-words text-slate-400">
              {resume.jobTitle}
            </h3>
          )}
          {!resume.companyName && !resume.jobTitle && (
            <h2 className="!text-slate-100 text-2xl font-semibold">Resume</h2>
          )}
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            AI reviewed
          </p>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={score} />
        </div>
      </div>
      {resumeUrl && (
        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt="resume"
              className="w-full h-[350px] max-sm:h-[220px] object-cover object-top transition duration-500 group-hover:scale-[1.01]"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
