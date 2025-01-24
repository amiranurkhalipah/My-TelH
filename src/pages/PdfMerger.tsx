import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PDFDocument } from "pdf-lib";

const PdfMerger = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length < 2) {
      toast({
        title: "Error",
        description: "Please select at least 2 PDF files to merge",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert FileList to array and ensure they are PDFs
      const pdfFiles = Array.from(files).filter(
        (file) => file.type === "application/pdf"
      );

      if (pdfFiles.length < 2) {
        throw new Error("Please select valid PDF files");
      }

      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      // Loop through each PDF and merge it
      for (const file of pdfFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      // Save the merged PDF
      const mergedPdfBytes = await mergedPdf.save();
      const mergedPdfBlob = new Blob([mergedPdfBytes], {
        type: "application/pdf",
      });

      // Create download link
      const downloadUrl = URL.createObjectURL(mergedPdfBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = "Merged.pdf";

      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up
      URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Success",
        description: "PDFs have been merged successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to merge PDFs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/")}>
        <ArrowLeft className="mr-2" />
        Kembali
      </Button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">PDF Merger</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <Input
              type="file"
              multiple
              accept=".pdf"
              onChange={(e) => setFiles(e.target.files)}
              className="hidden"
              id="pdf-files"
            />
            <label
              htmlFor="pdf-files"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 mb-4 text-gray-400" />
              <p className="text-lg mb-2">Drop your PDF files here</p>
              <p className="text-sm text-gray-400">or click to select files</p>
            </label>
          </div>

          {files && files.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium">Selected Files:</p>
              {Array.from(files).map((file, index) => (
                <p key={index} className="text-sm text-gray-400">
                  {file.name}
                </p>
              ))}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-stone-500 hover:bg-red-500"
            disabled={!files || files.length < 2 || isLoading}
          >
            {isLoading ? "Merging..." : "Merge PDFs"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PdfMerger;
