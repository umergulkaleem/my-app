import React from "react";
import { FileText, Mail, Zap } from "lucide-react";

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

export default HeroSection;
