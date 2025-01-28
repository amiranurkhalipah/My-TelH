import { Merge, FilePlus, GitPullRequestDraft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth/AuthContext";

const ACCESS_PASS = import.meta.env.VITE_ACCESS_PASS;

const features = [
  {
    icon: <FilePlus className="w-6 h-6" />,
    title: "Presence Generator",
    description: "Quickly fill the form, enjoy instant PDF results.",
    path: "/attendance-generator",
    requiresPassphrase: true,
  },
  {
    icon: <Merge className="w-6 h-6" />,
    title: "PDF Merger",
    description: "Combine multiple PDFs into a single document effortlessly",
    path: "/pdf-merger",
  },
  {
    icon: <GitPullRequestDraft className="w-6 h-6" />,
    title: "and more later...",
    description: "",
    comingSoon: true,
  },
];

export const FeatureGrid = () => {
  const navigate = useNavigate();

  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const { setIsAuthorized } = useAuth();
  const [selectedPath, setSelectedPath] = useState("");

  const handleFeatureClick = (feature: (typeof features)[0]) => {
    if (feature.requiresPassphrase) {
      setSelectedPath(feature.path || "");
      setIsDialogOpen(true);
    } else if (feature.path && !feature.comingSoon) {
      navigate(feature.path);
    }
  };

  const handlePassphraseSubmit = () => {
    if (passphrase === ACCESS_PASS) {
      setIsDialogOpen(false);
      setPassphrase("");
      setIsAuthorized(true);
      navigate(selectedPath);
    } else {
      toast({
        variant: "destructive",
        title: "Opps!",
        description: "Please enter the correct passphrase to access the page.",
      });
    }
  };

  return (
    <div className="py-4 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        The <span className="gradient-text">Tools</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`glass-card p-6 rounded-xl hover:scale-105 transition-transform duration-300 ${
              feature.comingSoon ? "opacity-70" : ""
            } ${feature.path ? "cursor-pointer" : ""}`}
            onClick={() =>
              feature.path && !feature.comingSoon && handleFeatureClick(feature)
            }
          >
            <div className="text-red-500 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto mt-24 text-center">
        <div className="p-6 bg-red-950/30 rounded-lg">
          <p className="text-gray-300 mb-2">
            This tool never sends documents placed by the User out of the User's
            browser.
          </p>
          <p className="text-gray-300">
            All processes carried out in this tool are 100% done on the client
            side (your side), we never send the files that the User places out
            of the User's browser.
          </p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Access Pass</DialogTitle>
            <DialogDescription>
              Please enter the passphrase to access the pages.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePassphraseSubmit()}
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-stone-400 hover:bg-red-500"
                onClick={handlePassphraseSubmit}
              >
                Next
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
