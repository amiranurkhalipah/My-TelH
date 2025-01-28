import { FileText } from "lucide-react";

export const HeroSection = () => {
  return (
    <div className="min-h-[48vh] flex flex-col items-center justify-center text-center px-4">
      <div className="animate-float">
        <img
          src="mytelh.png"
          alt="Mytelh Logo"
          className="w-32 h-32 mt-8 mb-2 object-contain"
        />
      </div>
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Simplify All of <span className="gradient-text">TLH</span> Documents
      </h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-16">
        Seamlessly manage, tooling, and produce detailed TLH administration
        document's to save time and improve efficiency.
      </p>
    </div>
  );
};
