import { Merge, FilePlus, BookDashed } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <FilePlus className="w-6 h-6" />,
    title: "Attendance Generator",
    description: "Quickly fill the form, enjoy instant PDF results.",
    path: "/attendance-generator",
  },
  {
    icon: <Merge className="w-6 h-6" />,
    title: "PDF Merger",
    description: "Combine multiple PDFs into a single document effortlessly",
    path: "/pdf-merger",
  },
  {
    icon: <BookDashed className="w-6 h-6" />,
    title: "and many more soon...",
    description: "",
    comingSoon: true,
  },
];

export const FeatureGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Everything Need for{" "}
        <span className="gradient-text">TLH Administration</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`glass-card p-6 rounded-xl hover:scale-105 transition-transform duration-300 ${
              feature.comingSoon ? "opacity-70" : ""
            } ${feature.path ? "cursor-pointer" : ""}`}
            onClick={() =>
              feature.path && !feature.comingSoon && navigate(feature.path)
            }
          >
            <div className="text-blue-400 mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
