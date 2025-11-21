import { TextInput, SelectInput } from "../formfields";
import type { RegistrationSubmission } from "../../../../types";

interface PersonalInfoSectionProps {
  formData: Partial<RegistrationSubmission>;
  errors: Record<string, string>;
  onChange: (field: keyof RegistrationSubmission, value: string | boolean | string[]) => void;
}

export function PersonalInfoSection({ formData, errors, onChange }: PersonalInfoSectionProps) {
  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          name="first_name"
          label="First Name"
          required
          value={formData.first_name || ""}
          onChange={(value) => onChange("first_name", value)}
          error={errors.first_name}
        />
        
        <TextInput
          name="last_name"
          label="Last Name"
          required
          value={formData.last_name || ""}
          onChange={(value) => onChange("last_name", value)}
          error={errors.last_name}
        />
      </div>
      
      <TextInput
        name="phone_number"
        label="Phone Number"
        required
        value={formData.phone_number || ""}
        onChange={(value) => onChange("phone_number", value)}
        error={errors.phone_number}
        placeholder="0712345678"
        inputMode="numeric"
        maxLength={10}
      />
      
      <SelectInput
        name="gender"
        label="Gender"
        required
        value={formData.gender || ""}
        onChange={(value) => onChange("gender", value)}
        options={["Male", "Female"]}
        error={errors.gender}
      />
    </div>
  );
}