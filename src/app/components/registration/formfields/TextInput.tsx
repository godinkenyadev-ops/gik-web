import { cn } from "@/app/lib/utils";
import { Input } from "../../ui/input";


interface TextInputProps {
  name: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
}

export function TextInput({ 
  name, 
  label, 
  required, 
  value, 
  onChange, 
  placeholder, 
  error, 
  inputMode, 
  maxLength 
}: TextInputProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1 text-sm font-medium text-slate-800">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      <Input
        type="text"
        name={name}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        className={cn(
          "h-11 sm:h-12 w-full rounded-2xl border px-4 text-base text-slate-900 shadow-sm bg-white transition-all",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
          error ? "border-rose-400" : "border-slate-200"
        )}
      />
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
}