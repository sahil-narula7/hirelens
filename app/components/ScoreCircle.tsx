const ScoreCircle = ({ score = 75 }: { score: number }) => {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = score / 100;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative h-[100px] w-[100px]">
      <svg
        height="100%"
        width="100%"
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="#334155"
          strokeWidth={stroke}
          fill="transparent"
        />
        {/* Partial circle with gradient */}
        <defs>
          <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r={normalizedRadius}
          stroke="url(#grad)"
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Score and issues */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-semibold text-slate-100">{`${score}/100`}</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
          score
        </span>
      </div>
    </div>
  );
};

export default ScoreCircle;
