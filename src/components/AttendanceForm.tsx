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
import { CalendarIcon, Plus, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generatePDF } from "@/lib/pdfGenerator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface FormData {
  kategoriTLH: string;
  unit: string;
  direktorat: string;
  periode: {
    month: string;
    year: string;
  };
  names: string[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  holidays: Date[];
  holidaysWeekend: boolean;
  dateSign: Date | undefined;
  passphrase: string;
}

const currentDate = new Date();
let nextDate = new Date();

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
          currentDate.getMonth(),
          currentDate.getDate()
        ),
        "yyyy",
        {
          locale: id,
        }
      ),
    },
    names: [""],
    dateRange: {
      from: undefined,
      to: undefined,
    },
    holidays: [],
    holidaysWeekend: true,
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
      dateSign: range.to,
    }));
    nextDate = new Date(
      range.from.getFullYear(),
      range.from.getMonth() + 1,
      range.from.getDay()
    );
  };

  const addAttendee = () => {
    setFormData((prev) => ({
      ...prev,
      names: [...formData.names, ""],
    }));
  };

  const removeAttendee = (index: number) => {
    if (formData.names.length === 1) {
      toast({
        title: "Opps!",
        description: "Minimal harus terisi 1 nama",
        variant: "destructive",
      });
      return;
    }
    const newAttendees = formData.names.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      names: newAttendees,
    }));
  };

  const updateAttendee = (index: number, value: string) => {
    const newAttendees = [...formData.names];
    newAttendees[index] = value;
    setFormData((prev) => ({
      ...prev,
      names: newAttendees,
    }));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const names = pastedText
      .split(/[\n,\t]/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length > 0) {
      const currentIndex = Number((e.target as HTMLInputElement).dataset.index);
      const newAttendees = [...formData.names];
      newAttendees[currentIndex] = names[0];

      const remainingNames = names.slice(1);

      setFormData((prev) => ({
        ...prev,
        names: [...newAttendees, ...remainingNames],
      }));

      toast({
        description: `Bertambah ${names.length} nama`,
      });
    }
  };

  const handleHolidayWeekend = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      holidaysWeekend: checked,
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

    if (formData.names.some((name) => !name.trim())) {
      toast({
        title: "Opps!",
        description: "Sepertinya ada kolom nama belum terisi",
        variant: "destructive",
      });
      return;
    }

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
        nama: formData.names,
        periode: `${formData.periode.month} ${formData.periode.year}`,
        dateSign: format(formData.dateSign, "PPP", { locale: id }),
      });
      toast({
        title: "Sukses!",
        description: "Daftar Hadir berhasil diunduh.",
      });
    } catch (error) {
      toast({
        title: "Gagal!",
        description: "Tidak bisa mengunduh daftar hadir!",
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
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium mb-2">Nama</label>
        <div className="space-y-3">
          {formData.names.map((attendee, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={attendee}
                onChange={(e) => updateAttendee(index, e.target.value)}
                onPaste={handlePaste}
                data-index={index}
                placeholder="Nama Lengkap atau `paste` beberapa nama"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeAttendee(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={addAttendee}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah
          </Button>
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
                month={nextDate}
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
        <div className="flex items-center gap-2">
          <Label className="text-xs">Akhir Pekan?</Label>
          <Checkbox
            className="data-[state=checked]:bg-slate-100 border-color-slate-300"
            defaultChecked={formData.holidaysWeekend}
            onCheckedChange={handleHolidayWeekend}
          />
        </div>
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
