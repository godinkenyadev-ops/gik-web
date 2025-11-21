import { cn } from "@/app/lib/utils";
import { Checkbox } from "../../ui/checkbox";

interface DaysMultiSelectProps {
  label: string;
  required?: boolean;
  days: string[];
  selectedDays: string[];
  onChange: (days: string[]) => void;
  error?: string;
}

export function DaysMultiSelect({ 
  label, 
  required, 
  days, 
  selectedDays, 
  onChange, 
  error 
}: DaysMultiSelectProps) {
  const formatDateForDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  };

  const handleSelectAll = () => {
    const allSelected = selectedDays.length === days.length;
    if (allSelected) {
      onChange([]);
    } else {
      onChange(days);
    }
  };

  const handleDayToggle = (day: string) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day));
    } else {
      onChange([...selectedDays, day]);
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
        {days.map((day) => {
          const isSelected = selectedDays.includes(day);

          return (
            <label
              key={day}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 sm:py-4 transition-all",
                "hover:border-emerald-500 hover:bg-emerald-50",
                isSelected && "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-500/50"
              )}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleDayToggle(day)}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 data-[state=checked]:text-white"
                />

                <span className="text-slate-800 font-medium">
                  {formatDateForDisplay(day)}
                </span>
              </div>
            </label>
          );
        })}
      </div>
      
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
}