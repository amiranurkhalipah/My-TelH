import { Github } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-gray-400 mb-4 md:mb-0">
          © 2025 TLH Tools. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a
            href="https://it.telkomuniversity.ac.id/bagian-devti/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Profile
          </a>
        </div>
      </div>
    </footer>
  );
};
