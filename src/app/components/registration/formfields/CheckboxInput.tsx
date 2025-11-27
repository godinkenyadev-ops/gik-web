import { Checkbox } from "../../ui/checkbox";


interface CheckboxInputProps {
  name: string;
  label: string;
  required?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

export function CheckboxInput({ 
  name, 
  label, 
  required, 
  checked, 
  onChange, 
  error 
}: CheckboxInputProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3">
        <Checkbox
          id={name}
          checked={checked}
          onCheckedChange={(value: boolean) => onChange(Boolean(value))}
          className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 data-[state=checked]:text-white"
        />
        <span className="text-slate-800">{label}</span>
        {required && <span className="text-rose-500">*</span>}
      </label>
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
}