import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: 20 * 1024 * 1024,
    });

  const file = acceptedFiles[0] ?? null;
  const formatSize = (b: number) =>
    b
      ? `${(b / 1024 ** Math.floor(Math.log(b) / Math.log(1024))).toFixed(2)} ${
          ["Bytes", "KB", "MB", "GB"][Math.floor(Math.log(b) / Math.log(1024))]
        }`
      : "";

  return (
    <div className="w-full section-card">
      <div
        {...getRootProps({
          className: `uploader-drag-area ${
            isDragActive ? "gradient-hover" : "hover:bg-slate-100"
          }`,
        })}
      >
        <input {...getInputProps()} />

        <div className="space-y-4 cursor-pointer">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
            <img src="/icons/info.svg" alt="upload" className="size-7" />
          </div>

          {file ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3">
                <img src="/images/pdf.png" alt="pdf" className="size-10" />
                <div className="text-left">
                  <p className="max-w-xs truncate text-sm font-medium text-slate-100">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatSize(file.size)} · Ready for analysis
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileSelect?.(null);
                }}
                className="cursor-pointer rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100"
                aria-label="Remove selected file"
              >
                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-base font-medium text-slate-200">
                Drag and drop your resume, or click to browse.
              </p>
              <p className="text-sm text-slate-400">
                PDF only, up to 20 MB. The first page will be previewed in the
                review.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
