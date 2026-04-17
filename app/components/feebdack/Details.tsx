import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "../Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className={cn(
        "flex flex-row gap-1 items-center px-2.5 py-1 rounded-full",
        score > 69
          ? "bg-badge-green"
          : score > 39
          ? "bg-badge-yellow"
          : "bg-badge-red",
      )}
    >
      <img
        src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
        alt="score"
        className="size-4"
      />
      <p
        className={cn(
          "text-sm font-medium",
          score > 69
            ? "text-badge-green-text"
            : score > 39
            ? "text-badge-yellow-text"
            : "text-badge-red-text",
        )}
      >
        {score}/100
      </p>
    </div>
  );
};

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex flex-row gap-3 items-center py-1.5">
      <p className="text-lg font-semibold text-slate-100">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

const CategoryContent = ({
  tips,
}: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="grid w-full grid-cols-1 gap-3 rounded-2xl border border-slate-700 bg-slate-950 p-5 md:grid-cols-2">
        {tips.map((tip, index) => (
          <div
            className="flex flex-row gap-2 items-center rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 shadow-sm"
            key={index}
          >
            <img
              src={
                tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
              }
              alt="score"
              className="size-5"
            />
            <p className="text-sm font-medium text-slate-300">{tip.tip}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4 w-full">
        {tips.map((tip, index) => (
          <div
            key={index + tip.tip}
            className={cn(
              "flex flex-col gap-2 rounded-2xl p-4 border",
              tip.type === "good"
                ? "bg-emerald-950/45 border-emerald-800 text-emerald-200"
                : "bg-amber-950/45 border-amber-800 text-amber-200",
            )}
          >
            <div className="flex flex-row gap-2 items-center">
              <img
                src={
                  tip.type === "good"
                    ? "/icons/check.svg"
                    : "/icons/warning.svg"
                }
                alt="score"
                className="size-5"
              />
              <p className="text-sm font-semibold">{tip.tip}</p>
            </div>
            <p className="text-sm leading-6 opacity-90">{tip.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="section-card flex flex-col gap-4 w-full p-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Detailed review
        </p>
        <h3 className="text-xl font-semibold text-slate-100">
          Drill into each evaluation area
        </h3>
      </div>
      <Accordion defaultOpen="tone-style">
        <AccordionItem id="tone-style">
          <AccordionHeader itemId="tone-style">
            <CategoryHeader
              title="Tone & Style"
              categoryScore={feedback.toneAndStyle.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="tone-style">
            <CategoryContent tips={feedback.toneAndStyle.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="content">
          <AccordionHeader itemId="content">
            <CategoryHeader
              title="Content"
              categoryScore={feedback.content.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="content">
            <CategoryContent tips={feedback.content.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="structure">
          <AccordionHeader itemId="structure">
            <CategoryHeader
              title="Structure"
              categoryScore={feedback.structure.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="structure">
            <CategoryContent tips={feedback.structure.tips} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem id="skills">
          <AccordionHeader itemId="skills">
            <CategoryHeader
              title="Skills"
              categoryScore={feedback.skills.score}
            />
          </AccordionHeader>
          <AccordionContent itemId="skills">
            <CategoryContent tips={feedback.skills.tips} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Details;
