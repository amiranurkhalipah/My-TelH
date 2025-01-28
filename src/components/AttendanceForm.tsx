import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generatePDF } from "@/lib/pdfGenerator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormData {
  kategoriTLH: string;
  unit: string;
  direktorat: string;
  periode: {
    month: string;
    year: string;
  };
  nama: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  holidays: Date[];
  dateSign: Date | undefined;
  passphrase: string;
}

const currentDate = new Date();

const AttendanceForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    kategoriTLH: "TLH NON ADM/ IT",
    unit: "Bagian Pengembangan Produk TI",
    direktorat: "Direktorat Pusat Teknologi Informasi",
    periode: {
      month: format(currentDate, "MMMM", {
        locale: id,
      }),
      year: format(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          currentDate.getDate()
        ),
        "yyyy",
        {
          locale: id,
        }
      ),
    },
    nama: "",
    dateRange: {
      from: undefined,
      to: undefined,
    },
    holidays: [],
    dateSign: undefined,
    passphrase: "",
  });

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const years = Array.from({ length: 5 }, (_, i) =>
    (new Date().getFullYear() - 1 + i).toString()
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setFormData((prev) => ({
      ...prev,
      dateRange: range,
    }));
  };

  const handleHolidaySelect = (dates: Date[] | undefined) => {
    if (dates) {
      setFormData((prev) => ({
        ...prev,
        holidays: dates,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.dateRange.from || !formData.dateRange.to) {
      toast({
        title: "Opps!",
        description: "Tanggal Periode belum terisi",
        variant: "destructive",
      });
      return;
    }

    if (!formData.passphrase) {
      toast({
        title: "Opps!",
        description: "Passphare harus terisi",
        variant: "destructive",
      });
    }

    if (!import.meta.env.VITE_PASSPHRASE) {
      toast({
        title: "Opps!",
        description: "Passphrase belum diatur",
        variant: "destructive",
      });
      return;
    }

    if (formData.passphrase != import.meta.env.VITE_PASSPHRASE) {
      toast({
        title: "Opps!",
        description: "Passphrase tidak valid",
        variant: "destructive",
      });
      return;
    }

    try {
      await generatePDF({
        ...formData,
        periode: `${formData.periode.month} ${formData.periode.year}`,
        dateSign: format(formData.dateSign, "PPP", { locale: id }),
      });
      toast({
        title: "Sukses!",
        description: "Daftar Hadir generated successfully",
      });
    } catch (error) {
      toast({
        title: "Gagal!",
        description: "Failed to generate daftar hadir!",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="kategoriTLH">Kategori TLH</Label>
          <Input
            id="kategoriTLH"
            name="kategoriTLH"
            value={formData.kategoriTLH}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit/Bagian</Label>
          <Input
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="direktorat">Direktorat/Fakultas</Label>
          <Input
            id="direktorat"
            name="direktorat"
            value={formData.direktorat}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Periode</Label>
          <div className="flex gap-2">
            <Select
              value={formData.periode.month}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  periode: { ...prev.periode, month: value },
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={formData.periode.year}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  periode: { ...prev.periode, year: value },
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="nama">Nama</Label>
          <Input
            id="nama"
            name="nama"
            placeholder="Nama Lengkap"
            value={formData.nama}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tanggal Periode</Label>
        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !formData.dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateRange.from ? (
                  format(formData.dateRange.from, "PPP")
                ) : (
                  <span>Mulai</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.dateRange.from}
                onSelect={(date) =>
                  handleDateRangeChange({ ...formData.dateRange, from: date })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !formData.dateRange.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateRange.to ? (
                  format(formData.dateRange.to, "PPP")
                ) : (
                  <span>Sampai</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                month={
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    currentDate.getDate()
                  )
                }
                mode="single"
                selected={formData.dateRange.to}
                onSelect={(date) =>
                  handleDateRangeChange({ ...formData.dateRange, to: date })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !formData.dateSign && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dateSign ? (
                  format(formData.dateSign, "PPP")
                ) : (
                  <span>Tandatangan</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                month={
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    currentDate.getDate()
                  )
                }
                mode="single"
                selected={formData.dateSign}
                onSelect={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    dateSign: date,
                  }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Hari Libur</Label>
        <Calendar
          mode="multiple"
          selected={formData.holidays}
          onSelect={handleHolidaySelect}
          className="rounded-md border"
        />
      </div>

      <div className="space-y-2">
        <Label>Phrase</Label>
        <Input
          name="passphrase"
          type="password"
          placeholder="*********"
          required
          onChange={handleInputChange}
        />
      </div>

      <Button type="submit" className="w-full bg-stone-300 hover:bg-red-500">
        Unduh
      </Button>
    </form>
  );
};

export default AttendanceForm;
