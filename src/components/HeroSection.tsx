import { FileText } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <div className="animate-float">
        <FileText className="w-16 h-16 mb-8 text-blue-400" />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Simplify All of <span className="gradient-text">Digital Documents</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-8">
        Seamlessly manage, tooling, and produce detailed TLH administration
        document's to save time and improve efficiency.
      </p>
    </div>
  );
};
