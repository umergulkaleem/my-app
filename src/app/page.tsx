"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  FileText,
  Mail,
  Zap,
  CheckCircle,
  UploadCloud,
  Loader2,
  XCircle,
} from "lucide-react";
import Chat from "../components/ChatOrchestrationComponent";

import WatsonDualChat from "@/components/WatsonChat";

// --- Global Styles ---
const GlobalStyles: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #f7f9fb; }
    
    /* Custom Keyframes for the Hero Blob animation */
    @keyframes blob {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      33% {
        transform: translate(30px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
    }
    .animate-blob {
      animation: blob 7s infinite cubic-bezier(0.6, -0.28, 0.735, 0.045);
    }
  `}</style>
);

// --- Type Definitions and Utilities ---

type FileType = "PDF" | "Image" | "Email" | "Other";

interface UploadStatus {
  fileName: string;
  type: FileType;
  size: number;
  status: "pending" | "uploading" | "processed" | "error";
  progress: number;
}

const getFileType = (name: string): FileType => {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "PDF";
  if (["jpg", "jpeg", "png", "gif"].includes(ext!)) return "Image";
  if (ext === "eml" || ext === "msg") return "Email";
  return "Other";
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// --- Header Component ---

const Header: React.FC = () => (
  <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <Zap className="h-7 w-7 text-indigo-700 transition duration-300 transform hover:rotate-6" />
        <span className="text-2xl font-extrabold tracking-tighter text-gray-900">
          AP Automator
        </span>
      </div>
      <nav className="hidden sm:block">
        <a
          href="#upload"
          className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow-md hover:bg-indigo-700 transition duration-300"
        >
          Start Uploading
        </a>
      </nav>
    </div>
  </header>
);

// --- Hero Section Component ---

const HeroSection: React.FC = () => (
  <section className="relative overflow-hidden bg-gray-900 pt-20 pb-32">
    <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-indigo-900 to-black"></div>

    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
      {/* Text Content */}
      <div className="text-left">
        <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">
          The Future of Finance Automation
        </p>
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight">
          Intelligent Invoice{" "}
          <span className="text-indigo-400">Processing.</span>
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-3xl">
          Upload any document—PDF, image, or email—and instantly initiate the
          automated accounts payable workflow orchestrated by IBM.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#upload"
            className="rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-indigo-500/30 hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Upload Invoice Now
          </a>
          <a
            href="#"
            className="rounded-xl px-8 py-4 text-lg font-semibold text-indigo-200 border border-indigo-500/50 hover:border-indigo-400 hover:text-white transition duration-300"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Feature Icons (Visuals) */}
      <div className="hidden lg:flex justify-center items-center relative h-96">
        <div className="absolute w-full h-full rounded-full bg-indigo-500/10 blur-3xl opacity-50 animate-pulse"></div>
        <div className="grid grid-cols-3 gap-8">
          <div className="p-6 text-center bg-white/5 backdrop-blur-sm rounded-2xl border border-indigo-700/50 shadow-2xl transition transform hover:scale-105">
            <FileText className="h-10 w-10 text-indigo-400 mx-auto" />
            <p className="mt-2 text-sm font-medium text-gray-200">PDF OCR</p>
          </div>
          <div className="p-6 text-center bg-white/5 backdrop-blur-sm rounded-2xl border border-indigo-700/50 shadow-2xl transition transform hover:scale-105 delay-100">
            <Zap className="h-10 w-10 text-indigo-400 mx-auto" />
            <p className="mt-2 text-sm font-medium text-gray-200">
              AI Extraction
            </p>
          </div>
          <div className="p-6 text-center bg-white/5 backdrop-blur-sm rounded-2xl border border-indigo-700/50 shadow-2xl transition transform hover:scale-105 delay-200">
            <Mail className="h-10 w-10 text-indigo-400 mx-auto" />
            <p className="mt-2 text-sm font-medium text-gray-200">
              Email Ingestion
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// --- Upload Component ---

const UploadComponent: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<UploadStatus | null>(null);

  // Simulates the backend processing delay and progress
  const simulateProcessing = useCallback((file: File) => {
    const fileType = getFileType(file.name);
    const initialStatus: UploadStatus = {
      fileName: file.name,
      type: fileType,
      size: file.size,
      status: "uploading",
      progress: 0,
    };
    setStatus(initialStatus);

    let progressInterval = setInterval(() => {
      setStatus((prev) => {
        if (!prev) return initialStatus;

        if (prev.progress >= 99) {
          clearInterval(progressInterval);
          // Randomly simulate success or error for better demo feedback
          const isSuccess = Math.random() > 0.1;
          setTimeout(() => {
            setStatus((s) =>
              s
                ? {
                    ...s,
                    status: isSuccess ? "processed" : "error",
                    progress: 100,
                  }
                : null
            );
          }, 700);
          return { ...prev, progress: 99 };
        }

        // Smoother, but still random incremental progress
        return {
          ...prev,
          progress: Math.min(
            99,
            prev.progress + Math.floor(Math.random() * 5) + 3
          ),
        };
      });
    }, 200);

    // Cleanup function for the interval
    return () => clearInterval(progressInterval);
  }, []);

  const handleFileDrop = useCallback(
    (files: FileList | null) => {
      setIsDragging(false);
      if (files && files.length > 0) {
        simulateProcessing(files[0]);
      }
    },
    [simulateProcessing]
  );

  // Drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileDrop(e.dataTransfer.files);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileDrop(e.target.files);
    e.target.value = "";
  };
  const handleReset = () => setStatus(null);

  // Computed status details for UI
  const { statusIcon, statusText, progressBarColor } = useMemo(() => {
    if (!status)
      return {
        statusIcon: null,
        statusText: null,
        progressBarColor: "bg-indigo-500",
      };

    let icon, text, color;
    switch (status.status) {
      case "uploading":
      case "pending":
        icon = <Loader2 className="h-7 w-7 text-indigo-500 animate-spin" />;
        text = `Processing and Uploading to IBM Orchestrate... (${status.progress}%)`;
        color = "bg-indigo-500";
        break;
      case "processed":
        icon = <CheckCircle className="h-7 w-7 text-emerald-500" />;
        text = "Success! Data extracted and workflow initiated.";
        color = "bg-emerald-500";
        break;
      case "error":
        icon = <XCircle className="h-7 w-7 text-red-500" />;
        text = "Workflow Error. Please check file format or retry upload.";
        color = "bg-red-500";
        break;
      default:
        icon = null;
        text = null;
        color = "bg-indigo-500";
    }
    return { statusIcon: icon, statusText: text, progressBarColor: color };
  }, [status]);

  return (
    <section
      id="upload"
      className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16"
    >
      <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 text-center mb-16">
        Secure Document Ingestion
      </h2>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Column: Feature List */}
        <div className="lg:col-span-1 space-y-8">
          <h3 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">
            Supported Input Types
          </h3>
          {[
            {
              icon: FileText,
              title: "PDF & Scans",
              description: "High-speed OCR for all PDF documents.",
            },
            {
              icon: Zap,
              title: "Image Recognition",
              description:
                "JPEG/PNG processing for receipts and photo captures.",
            },
            {
              icon: Mail,
              title: "Email Ingestion",
              description: "Direct processing of email attachments and bodies.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-white transition duration-300"
            >
              <feature.icon className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-md font-semibold text-gray-900">
                  {feature.title}
                </p>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Upload Zone & Status */}
        <div className="lg:col-span-2">
          <div
            className={`p-10 rounded-3xl border-4 transition duration-500 h-full flex flex-col justify-center items-center text-center ${
              isDragging
                ? "border-indigo-500 bg-indigo-50 border-dashed ring-4 ring-indigo-200"
                : "border-gray-200 bg-white border-solid hover:border-indigo-300"
            } shadow-2xl shadow-gray-200/50`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <UploadCloud
              className={`h-16 w-16 transition duration-300 ${
                isDragging ? "text-indigo-600" : "text-gray-400"
              }`}
            />
            <p className="mt-6 text-lg text-gray-700 font-semibold">
              Drop file here, or
            </p>
            <label
              htmlFor="file-upload"
              className="mt-2 relative cursor-pointer font-bold text-indigo-600 hover:text-indigo-700 transition duration-150 text-lg"
            >
              Click to select a file
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleInputChange}
                accept=".pdf,image/*,.eml,.msg"
              />
            </label>
            <p className="mt-2 text-sm text-gray-500">
              Maximum file size 10MB. Automatically starts workflow.
            </p>
          </div>
        </div>
      </div>

      {/* Floating File Status Display */}
      {status && (
        <div className="fixed bottom-0 right-0 m-6 p-6 bg-white border-t-4 border-indigo-500 rounded-xl shadow-2xl w-full max-w-sm transform transition duration-500 animate-in slide-in-from-bottom">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {statusIcon}
              <div className="truncate max-w-[200px]">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {status.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {status.type} ({formatFileSize(status.size)})
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-gray-400 hover:text-gray-600 ml-4 p-1 rounded-full hover:bg-gray-100 transition"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 w-full">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
                style={{ width: `${status.progress}%` }}
              />
            </div>
            <p
              className={`mt-2 text-xs font-medium ${
                status.status === "processed"
                  ? "text-emerald-600"
                  : status.status === "error"
                  ? "text-red-600"
                  : "text-indigo-600"
              }`}
            >
              {statusText}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

// --- Footer Component ---

const Footer: React.FC = () => (
  <footer className="bg-gray-900 mt-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} AP Automator | Hackathon Project.
        Powered by IBM Orchestrate.
      </div>
    </div>
  </footer>
);

// --- Main App Component (Renamed to App for clarity) ---

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <GlobalStyles />
      <Header />
      <main>
        <HeroSection />
        <UploadComponent />
        <Chat />
        <WatsonDualChat />
      </main>
      <Footer />
    </div>
  );
};

export default App;
