import React from "react";
import { Zap } from "lucide-react";

const Header: React.FC = () => (
  <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <Zap className="h-7 w-7 text-indigo-700 transition duration-300 transform hover:rotate-6" />
        <span className="text-2xl font-extrabold tracking-tighter text-gray-900">
          Account Payable
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

export default Header;
