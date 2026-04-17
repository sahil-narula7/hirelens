import ScoreGauge from "../ScoreGauge";

const ScoreBadge = ({ score }: { score: number }) => {
  const badgeColor =
    score > 69
      ? "bg-badge-green"
      : score > 49
      ? "bg-badge-yellow"
      : "bg-badge-red";
  const textColor =
    score > 69
      ? "text-green-600"
      : score > 49
      ? "text-yellow-600"
      : "text-red-600";
  const badgeText =
    score > 69 ? "Strong" : score > 49 ? "Good Start" : "Needs Work";

  return (
    <div className={`score-badge ${badgeColor}`}>
      <p className={`text-xs ${textColor} font-semibold`}>{badgeText}</p>
    </div>
  );
};

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 69
      ? "text-green-600"
      : score > 49
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-lg font-medium text-slate-100">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-lg font-semibold text-slate-100">
          <span className={textColor}>{score}</span>/100
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="section-card w-full overflow-hidden">
      <div className="flex flex-row max-sm:flex-col items-center gap-8 p-6">
        <div className="rounded-2xl bg-slate-950 p-4">
          <ScoreGauge score={feedback.overallScore} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Executive summary
          </p>
          <h2 className="text-2xl font-semibold text-slate-100">
            Resume quality overview
          </h2>
          <p className="max-w-xl text-sm text-slate-400">
            The score reflects ATS compatibility, content quality, structure,
            and skills alignment.
          </p>
        </div>
      </div>
      <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
      <Category title="Content" score={feedback.content.score} />
      <Category title="Structure" score={feedback.structure.score} />
      <Category title="Skills" score={feedback.skills.score} />
    </div>
  );
};

export default Summary;
