import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { AIResponseFormat } from "~/constants";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";
import type { Route } from "./+types/upload";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "HireLens | Upload Resume" },
    { name: "description", content: "Upload your resume to get feedback" },
  ];
}

const UploadPage = () => {
  const { auth, isLoading, error, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [statusText, setStatusText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/upload");
    }
  }, [isLoading]);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;
    if (!file) {
      return;
    }
    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    setIsProcessing(true);
    setStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([file]);

    if (!uploadedFile) {
      setStatusText("Error: Failed to upload file");
      return;
    }

    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file);

    if (!imageFile.file) {
      setStatusText("Error: Failed to convert PDF to image");
      return;
    }

    setStatusText("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);

    if (!uploadedImage) {
      setStatusText("Error: Failed to upload image");
      return;
    }

    setStatusText("Preparing data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName: companyName,
      jobTitle: jobTitle,
      jobDescription: jobDescription,
      feedback: "",
    };
    await kv.set(`resume:${uuid}`, JSON.stringify(data));

    setStatusText("Analyzing...");
    const feedback = await ai.feedback(
      uploadedFile.path,
      `You are an expert in ATS (Applicant Tracking System) and resume analysis.
      Please analyze and rate this resume and suggest how to improve it.
      The rating can be low if the resume is bad.
      Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
      If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
      If available, use the job description for the job user is applying to to give more detailed feedback.
      If provided, take the job description into consideration.
      The job title is: ${jobTitle}
      The job description is: ${jobDescription}
      Provide the feedback using the following format:
      ${AIResponseFormat}
      Return the analysis as an JSON object, without any other text and without the backticks.
      Do not include any other text or comments.`,
    );

    if (!feedback) {
      setStatusText("Error: Failed to analyze resume");
      return;
    }

    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;
    data.feedback = JSON.parse(feedbackText);

    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete, redirecting...");
    navigate(`/resume/${uuid}`);
  };

  return (
    <main>
      <div className="page-shell">
        <Navbar />
        <section className="main-section">
          <div className="section-card w-full p-8">
            <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  New review
                </p>
                <h1>Submit a resume for structured feedback</h1>
                {isProcessing ? (
                  <h2>{statusText}</h2>
                ) : (
                  <h2>
                    Provide the target role and job description so the analysis
                    can be aligned with the position.
                  </h2>
                )}

                {isProcessing && (
                  <div className="muted-panel mt-6 flex flex-col items-center gap-4 text-center">
                    <img
                      src="/images/resume-scan.gif"
                      className="w-48 opacity-90"
                    />
                    <p className="text-sm text-slate-400">
                      The document is being uploaded, converted, and scored.
                    </p>
                  </div>
                )}

                {!isProcessing && (
                  <form
                    id="upload-form"
                    onSubmit={handleSubmit}
                    className="mt-6 flex flex-col gap-5"
                  >
                    <div className="grid w-full gap-5 md:grid-cols-2">
                      <div className="form-div">
                        <label htmlFor="company-name">Company Name</label>
                        <input
                          type="text"
                          name="company-name"
                          placeholder="Company Name"
                          id="company-name"
                        />
                      </div>

                      <div className="form-div">
                        <label htmlFor="job-title">Job Title</label>
                        <input
                          type="text"
                          name="job-title"
                          placeholder="Job Title"
                          id="job-title"
                        />
                      </div>
                    </div>

                    <div className="form-div">
                      <label htmlFor="job-description">Job Description</label>
                      <textarea
                        name="job-description"
                        id="job-description"
                        placeholder="Paste the role description here"
                        rows={6}
                      />
                    </div>

                    <div className="form-div">
                      <label htmlFor="job-description">Upload Resume</label>
                      <FileUploader onFileSelect={handleFileSelect} />
                    </div>

                    {file && (
                      <button
                        className="primary-button w-full md:w-auto"
                        type="submit"
                      >
                        Save and Analyze Resume
                      </button>
                    )}
                  </form>
                )}
              </div>

              <aside className="muted-panel space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Review standards
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-100">
                    What the report includes
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-3 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 shadow-sm">
                    <span className="font-semibold text-slate-100">01</span>
                    <span>ATS compatibility and keyword alignment.</span>
                  </li>
                  <li className="flex gap-3 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 shadow-sm">
                    <span className="font-semibold text-slate-100">02</span>
                    <span>Structure, clarity, and presentation quality.</span>
                  </li>
                  <li className="flex gap-3 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 shadow-sm">
                    <span className="font-semibold text-slate-100">03</span>
                    <span>Content strength, tone, and role-specific fit.</span>
                  </li>
                </ul>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default UploadPage;
