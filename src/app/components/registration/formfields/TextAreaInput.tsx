interface TextAreaInputProps {
    name: string;
    label: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    maxLength?: number;
    rows?: number;
  }
  
  export function TextAreaInput({ 
    name, 
    label, 
    required, 
    value, 
    onChange, 
    error, 
    placeholder,
    maxLength = 500,
    rows = 4 
  }: TextAreaInputProps) {
    return (
      <div className="space-y-2">
        <label className="flex items-center gap-1 text-sm font-medium text-slate-800">
          {label}
          {required && <span className="text-rose-500">*</span>}
        </label>
        
        <textarea
          name={name}
          required={required}
          rows={rows}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          maxLength={maxLength}
          className={`w-full rounded-2xl border px-4 py-2.5 text-sm sm:text-base text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            error ? "border-rose-400" : "border-slate-200"
          }`}
          placeholder={placeholder}
        />
  
        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
          {error && (
            <p className="text-rose-500">{error}</p>
          )}
          <p>{value.length}/{maxLength}</p>
        </div>
      </div>
    );
  }