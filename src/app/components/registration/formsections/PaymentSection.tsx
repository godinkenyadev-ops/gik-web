import { SelectInput, TextInput } from "../formfields";
import type { RegistrationSubmission, MissionEventDetails } from "../../../../types";

interface PaymentSectionProps {
  formData: Partial<RegistrationSubmission> & {
    can_pay_full?: boolean;
    support_needed?: string;
    coming_as_couple?: boolean;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string | boolean | { day: number; day_date: string }[]) => void;
  missionData: MissionEventDetails;
}

export function PaymentSection({ formData, errors, onChange, missionData }: PaymentSectionProps) {
  const displayedFee = missionData.registration_fee || 0;

  return (
    <div className="space-y-6">      
      <SelectInput
        name="can_pay_full"
        label="Can pay the full amount?"
        required
        value={formData.can_pay_full === false ? "No" : "Yes"}
        onChange={(value: string) => onChange("can_pay_full", value === "Yes")}
        options={["Yes", "No"]}
        error={errors.can_pay_full}
      />
      
      {formData.can_pay_full === false && (
        <TextInput
          name="support_needed"
          label="Support needed (Amount)"
          required
          value={formData.support_needed || ""}
          onChange={(value: string) => onChange("support_needed", value)}
          error={errors.support_needed}
          inputMode="numeric"
        />
      )}
      
      {missionData.registration_fee_required && displayedFee > 0 && (
        <div className="rounded-3xl border border-emerald-100 bg-linear-to-r from-emerald-50 to-teal-50 px-5 py-4 text-center text-base font-medium text-primary">
          Registration fee: KES {displayedFee.toLocaleString("en-KE")}{" "}
          {formData.coming_as_couple && "(couple)"}
          {formData.can_pay_full === false && formData.support_needed && (
            <span className="mt-1 block text-sm font-medium text-emerald-700">
              Requested support: KES{" "}
              {(formData.support_needed as string).replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}