import { cn } from "~/lib/utils";

const ATS = ({
  score,
  suggestions,
}: {
  score: number;
  suggestions: { type: "good" | "improve"; tip: string }[];
}) => {
  return (
    <div
      className={cn(
        "section-card w-full p-6 flex flex-col gap-4",
        score > 69
          ? "bg-gradient-to-b from-emerald-950/50 to-slate-900"
          : score > 49
          ? "bg-gradient-to-b from-amber-950/50 to-slate-900"
          : "bg-gradient-to-b from-red-950/45 to-slate-900",
      )}
    >
      <div className="flex flex-row gap-4 items-center">
        <img
          src={
            score > 69
              ? "/icons/ats-good.svg"
              : score > 49
              ? "/icons/ats-warning.svg"
              : "/icons/ats-bad.svg"
          }
          alt="ATS"
          className="h-10 w-10"
        />
        <div>
          <p className="text-lg font-semibold text-slate-100">
            ATS Score - {score}/100
          </p>
          <p className="text-sm text-slate-400">
            How easily the resume passes automated screening.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-slate-200">Review highlights</p>
        <p className="text-sm text-slate-400">
          Your resume was scanned like an employer would. Here is the summary of
          what the system detected:
        </p>
        {suggestions.map((suggestion, index) => (
          <div
            className="flex flex-row gap-2 items-start rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"
            key={index}
          >
            <img
              src={
                suggestion.type === "good"
                  ? "/icons/check.svg"
                  : "/icons/warning.svg"
              }
              alt="ATS"
              className="mt-0.5 h-4 w-4"
            />
            <p className="text-sm text-slate-300">{suggestion.tip}</p>
          </div>
        ))}
        <p className="text-sm text-slate-400">
          Improve the score by applying the suggestions above and aligning the
          document to the job description.
        </p>
      </div>
    </div>
  );
};

export default ATS;
