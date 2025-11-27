import { TextInput, DateInput, CheckboxInput, DaysMultiSelect, TextAreaInput } from "../formfields";
import { RegistrationSubmission, MissionEventDetails } from "../../../../types";
import { eachDayOfInterval, format } from "date-fns";

interface MissionSpecificSectionProps {
  formData: Partial<RegistrationSubmission> & {
    mission_date?: string;
    coming_as_couple?: boolean;
    partner_name?: string;
    attending_days?: { day: number; day_date: string }[];
  };
  errors: Record<string, string>;
  onChange: (field: string, value: any) => void;
  missionData: MissionEventDetails;
}

const getMissionDays = (start: string, end: string): string[] => {
  return eachDayOfInterval({
    start: new Date(start),
    end: new Date(end),
  }).map((d) => format(d, "yyyy-MM-dd"));
};

export function MissionSpecificSection({
  formData,
  errors,
  onChange,
  missionData,
}: MissionSpecificSectionProps) {
  const missionDays =
    missionData.event_type === "week_long" && missionData.start_date && missionData.end_date
      ? getMissionDays(missionData.start_date, missionData.end_date)
      : [];

  const formatDateForDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {missionData.event_type === "week_long" && (
        <>
          <CheckboxInput
            name="coming_as_couple"
            label="Coming as a couple?"
            checked={formData.coming_as_couple || false}
            onChange={(checked) => onChange("coming_as_couple", checked)}
            error={errors.coming_as_couple}
          />

          {formData.coming_as_couple && (
            <TextInput
              name="partner_name"
              label="Partner's Full Name"
              required
              value={formData.partner_name || ""}
              onChange={(value) => onChange("partner_name", value)}
              error={errors.partner_name}
            />
          )}

          <TextInput
            name="travelling_from"
            label="Travelling From"
            required
            value={formData.travelling_from || ""}
            onChange={(value) => onChange("travelling_from", value)}
            error={errors.travelling_from}
            placeholder="City"
          />

          <DaysMultiSelect
            label="Days you will attend"
            required
            days={missionDays}
            selectedDays={formData.attending_days || []}
            onChange={(days) => onChange("attending_days", days)}
            error={errors.attending_days}
          />

          <TextAreaInput
            name="dietary_watch"
            label="Dietary Restrictions (Leave empty if none)"
            value={formData.dietary_watch || ""}
            onChange={(value) => onChange("dietary_watch", value)}
            error={errors.dietary_watch}
            placeholder="List any dietary restrictions or allergies..."
            maxLength={500}
          />
        </>
      )}

      {missionData.event_type === "one_day" && (
        <DateInput
          name="mission_date"
          label="Mission Date"
          displayDate={formatDateForDisplay(missionData.start_date)}
          value={formData.mission_date || ""}
          onChange={(value) => onChange("mission_date", value)}
          error={errors.mission_date}
        />
      )}
    </div>
  );
}