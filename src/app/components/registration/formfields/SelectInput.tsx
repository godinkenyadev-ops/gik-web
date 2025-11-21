import { cn } from "@/app/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";


interface SelectInputProps {
  name: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  placeholder?: string;
}

export function SelectInput({ 
  name, 
  label, 
  required, 
  value, 
  onChange, 
  options, 
  error,
  placeholder = "Select..."
}: SelectInputProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1 text-sm font-medium text-slate-800">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "h-11 sm:h-12 w-full rounded-2xl border px-4 py-3 text-base text-slate-900 shadow-sm bg-white transition-all",
            "focus:ring-2 focus:ring-primary/20 focus:border-primary",
            error ? "border-rose-400 animate-[shake_0.3s]" : "border-slate-200"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border border-slate-200 bg-white shadow-lg">
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              className="cursor-pointer rounded-xl px-3 py-2 text-slate-800 hover:bg-primary/10 hover:text-primary transition"
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
}