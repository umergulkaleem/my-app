import React from "react";

const Footer: React.FC = () => (
  <footer className="bg-gray-900 mt-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Account Payable | Hackathon Project.
        Powered by IBM Orchestrate.
      </div>
    </div>
  </footer>
);

export default Footer;
