import { cn } from "@/app/lib/utils";
import { Input } from "../../ui/input";


interface DateInputProps {
  name: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  min?: string;
  max?: string;
  displayDate?: string;
}

export function DateInput({ 
  name, 
  label, 
  required, 
  value, 
  onChange, 
  error, 
  min, 
  max, 
  displayDate 
}: DateInputProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1 text-sm font-medium text-slate-800">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      
      {displayDate ? (
        <div className="flex h-11 sm:h-12 items-center justify-between rounded-2xl border border-slate-200 bg-gray-50/80 px-4 text-base shadow-sm backdrop-blur-sm">
          <span className="font-medium text-slate-800">
            {displayDate}
          </span>
        </div>
      ) : (
        <Input
          type="date"
          name={name}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          className={cn(
            "h-11 sm:h-12 w-full rounded-2xl border px-4 text-base text-slate-900 shadow-sm bg-white transition-all",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
            error ? "border-rose-400" : "border-slate-200"
          )}
        />
      )}
      
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
}