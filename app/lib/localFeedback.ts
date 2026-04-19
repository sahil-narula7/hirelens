const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const scoreFromText = (text: string): number => {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100000;
  }
  return hash;
};

const explanation = (tip: string, context: string) =>
  `${tip} This guidance is based on the ${context} and helps improve recruiter readability.`;

export const generateLocalFeedback = (input: {
  companyName?: string;
  jobTitle?: string;
  jobDescription?: string;
  fileName?: string;
}): Feedback => {
  const seedText = `${input.companyName ?? ""}|${input.jobTitle ?? ""}|${
    input.jobDescription ?? ""
  }|${input.fileName ?? ""}`;

  const seed = scoreFromText(seedText);
  const jobContextBoost = input.jobDescription ? 8 : 0;
  const titleBoost = input.jobTitle ? 5 : 0;

  const overallScore = clamp(
    62 + (seed % 22) + jobContextBoost + titleBoost,
    58,
    95,
  );
  const atsScore = clamp(overallScore - 2 + (seed % 5), 55, 98);
  const toneScore = clamp(overallScore - 4 + ((seed >> 1) % 6), 50, 98);
  const contentScore = clamp(overallScore - 3 + ((seed >> 2) % 7), 50, 98);
  const structureScore = clamp(overallScore - 1 + ((seed >> 3) % 6), 50, 98);
  const skillsScore = clamp(overallScore - 5 + ((seed >> 4) % 7), 48, 98);

  const roleReference = input.jobTitle || "target role";

  return {
    overallScore,
    ATS: {
      score: atsScore,
      tips: [
        {
          type: "good",
          tip: "Keywords are mostly aligned with the target role.",
        },
        {
          type: "improve",
          tip: `Mirror more exact phrasing from the ${roleReference} posting.`,
        },
        {
          type: "improve",
          tip: "Use a single-column layout to maximize ATS parsing accuracy.",
        },
      ],
    },
    toneAndStyle: {
      score: toneScore,
      tips: [
        {
          type: "good",
          tip: "Professional tone remains consistent across sections.",
          explanation: explanation(
            "The wording is clear and business-appropriate.",
            "language style",
          ),
        },
        {
          type: "improve",
          tip: "Start bullet points with stronger action verbs.",
          explanation: explanation(
            "Impact-first language increases credibility and clarity.",
            "experience bullets",
          ),
        },
      ],
    },
    content: {
      score: contentScore,
      tips: [
        {
          type: "good",
          tip: "Experience sections show relevant responsibilities.",
          explanation: explanation(
            "The scope of work is easy to understand.",
            "experience relevance",
          ),
        },
        {
          type: "improve",
          tip: "Add measurable outcomes to each major achievement.",
          explanation: explanation(
            "Metrics make accomplishments more persuasive.",
            "achievement quality",
          ),
        },
      ],
    },
    structure: {
      score: structureScore,
      tips: [
        {
          type: "good",
          tip: "Section order is logical and recruiter-friendly.",
          explanation: explanation(
            "Important information appears early in the document.",
            "information hierarchy",
          ),
        },
        {
          type: "improve",
          tip: "Tighten long bullet points to one idea each.",
          explanation: explanation(
            "Shorter bullets improve scan speed and retention.",
            "readability",
          ),
        },
      ],
    },
    skills: {
      score: skillsScore,
      tips: [
        {
          type: "good",
          tip: "Core tools and technologies are clearly listed.",
          explanation: explanation(
            "Skill discoverability is strong for quick screening.",
            "skills section",
          ),
        },
        {
          type: "improve",
          tip: "Group skills by domain (language, framework, tooling).",
          explanation: explanation(
            "Categorization helps hiring teams evaluate fit faster.",
            "skills organization",
          ),
        },
      ],
    },
  };
};
