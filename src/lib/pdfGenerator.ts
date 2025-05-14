import { jsPDF } from "jspdf";
import { format, eachDayOfInterval, isWeekend } from "date-fns";

interface FormData {
  kategoriTLH: string;
  unit: string;
  direktorat: string;
  periode: string;
  nama: string[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  holidays: Date[];
  holidaysWeekend: boolean;
  dateSign: string;
}

export const generatePDF = async (data: FormData) => {
  if (!data.dateRange.from || !data.dateRange.to) return;

  const doc = new jsPDF({
    orientation: "l",
    unit: "mm",
    format: [216, 400],
  });

  for (let i = 0; i < data.nama.length; i++) {
    let nama = data.nama[i];

    doc.setFont("helvetica");

    // Add header
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.text(
      "DAFTAR HADIR TENAGA LEPAS HARIAN (TLH)",
      doc.internal.pageSize.width / 2,
      15,
      { align: "center" }
    );
    doc.text("TELKOM UNIVERSITY", doc.internal.pageSize.width / 2, 22, {
      align: "center",
    });

    // Add form data with proper alignment
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text(`Kategori TLH`, 10, 35);
    doc.text(`: ${data.kategoriTLH}`, 55, 35);

    doc.text(`Unit / Bagian`, 10, 42);
    doc.text(`: ${data.unit}`, 55, 42);

    doc.text(`Direktorat/Fakultas`, 10, 49);
    doc.text(`: ${data.direktorat}`, 55, 49);

    doc.text(`Periode`, 10, 56);
    doc.text(`: Bulan ${data.periode}`, 55, 56);

    // Generate calendar grid
    const days = eachDayOfInterval({
      start: data.dateRange.from,
      end: data.dateRange.to,
    });

    // Add table headers
    let startY = 70;
    const cellWidth = 11;
    const cellHeight = 22;

    // Header row
    doc.rect(10, startY, 10, cellHeight); // No column
    doc.rect(20, startY, 40, cellHeight); // Nama column

    doc.setFont(undefined, "bold");
    doc.text("No", 13, startY + 12);
    doc.text("Nama", 35, startY + 12);

    // Add dates as headers with weekend highlighting
    days.forEach((day, index) => {
      const x = 60 + index * cellWidth;

      doc.rect(x, startY, cellWidth, cellHeight);

      // For rotated text, we'll use text transformation
      const textX = x + 7;
      const textY = startY + 19;
      const angleInRadians = (90 * Math.PI) / 180;

      doc.text(format(day, "dd MMM yy"), textX, textY, {
        angle: 90,
      });
    });
    doc.setFont(undefined, "normal");

    // Add data row
    startY += cellHeight;
    doc.rect(10, startY, 10, cellHeight);
    doc.text("1", 14, startY + 7);
    doc.rect(20, startY, 40, cellHeight);

    // Check if the name length exceeds 15 characters and split into multiple lines if necessary
    const nameLines =
      nama.length > 15 ? nama.match(/.{1,15}(?=\s|$)|\S+$/g) : [nama];
    nameLines.forEach((line, index) => {
      doc.text(line.trim(), 22, startY + 7 + index * 5);
    });

    // Add empty cells for dates
    days.forEach((day, index) => {
      const x = 60 + index * cellWidth;
      if (
        data.holidays.some((holiday) => holiday.getTime() === day.getTime())
      ) {
        doc.setFillColor(117, 117, 117);
      } else {
        if (isWeekend(day) && data.holidaysWeekend) {
          doc.setFillColor(117, 117, 117);
        } else {
          doc.setFillColor(255, 255, 255);
        }
      }
      doc.rect(x, startY, cellWidth, cellHeight, "DF");
    });

    // Add signature section
    const signatureY = startY + 40;
    const dateSign = data.dateSign;

    doc.text("Mengetahui/Menyetujui:", 27, signatureY);
    doc.text("Kepala Bagian Pengembangan Produk TI", 15, signatureY + 7);

    doc.text("Fiat Bayar", doc.internal.pageSize.width / 3 + 15, signatureY, {
      align: "center",
    });

    doc.text("Verifikasi", doc.internal.pageSize.width / 2 + 20, signatureY);

    // Add date and location
    doc.text(
      `Bandung, ${dateSign}`,
      doc.internal.pageSize.width - 80,
      signatureY - 7
    );
    doc.text("Dibuat Oleh,", doc.internal.pageSize.width - 60, signatureY);
    doc.text(
      "Staff Bagian Pengembangan Produk TI",
      doc.internal.pageSize.width - 80,
      signatureY + 7
    );

    // Add signature names
    const signatureSpaceY = 30;
    doc.text("Monterico Adrian", 30, signatureY + signatureSpaceY);
    doc.text(
      "Amira Nur Khalipah",
      doc.internal.pageSize.width - 65,
      signatureY + signatureSpaceY
    );

    if (i !== data.nama.length - 1) {
      doc.addPage();
    }
  }

  // Save the PDF
  doc.save(`DH TLH ${data.periode}.pdf`);
};
