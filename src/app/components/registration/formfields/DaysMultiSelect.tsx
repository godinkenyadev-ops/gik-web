import { cn } from "@/app/lib/utils";
import { Checkbox } from "../../ui/checkbox";

interface DaysMultiSelectProps {
  label: string;
  required?: boolean;
  days: string[];
  selectedDays: { day: number; day_date: string }[];
  onChange: (days: { day: number; day_date: string }[]) => void;
  error?: string;
}

export function DaysMultiSelect({ 
  label,
  required,
  days,
  selectedDays,
  onChange,
  error,
}: DaysMultiSelectProps) {

  const formatDateForDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  const selectedDateSet = new Set(selectedDays.map((d) => d.day_date));

  const handleSelectAll = () => {
    if (selectedDays.length === days.length) {
      onChange([]); 
    } else {
      onChange(
        days.map((date, index) => ({
          day: index +1,
          day_date: date,
        }))
      );
    }
  };

  const handleDayToggle = (date: string, dayIndex: number) => {
    if (selectedDateSet.has(date)) {
      onChange(selectedDays.filter((d) => d.day_date !== date));
    } else {
      onChange([...selectedDays, { day: dayIndex, day_date: date }]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-1 text-sm font-medium text-slate-800">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      
      <button
        type="button"
        className="inline-flex items-center rounded-full border border-primary/30 px-3 py-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-wide"
        onClick={handleSelectAll}
      >
        {selectedDays.length === days.length ? "Clear all days" : "Select all days"}
      </button>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {days.map((date, index) => {
          const isSelected = selectedDateSet.has(date);

          return (
            <label
              key={date}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 sm:py-4 transition-all",
                "hover:border-emerald-500 hover:bg-emerald-50",
                isSelected && "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-500/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleDayToggle(date, index)}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 data-[state=checked]:text-white"
                />

                <span className="text-slate-800 font-medium">
                  {formatDateForDisplay(date)}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}