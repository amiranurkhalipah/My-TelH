import AttendanceForm from "@/components/AttendanceForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AttendanceGenerator = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black py-4 px-4 sm:px-6 lg:px-8">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/")}>
        <ArrowLeft className="mr-2" />
        Kembali
      </Button>
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-6 rounded-xl shadow-sm sm:p-8">
          <AttendanceForm />
        </div>
      </div>
    </div>
  );
};

export default AttendanceGenerator;
