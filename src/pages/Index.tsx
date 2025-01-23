import AttendanceForm from "@/components/AttendanceForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-black py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-50 rounded-lg shadow-sm p-6 sm:p-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Sign Form
          </h1>
          <br />
          <AttendanceForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
