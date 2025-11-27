import { registrationApi } from "@/lib/registrationApi";
import {
  type MissionEventDetails,
  type RegistrationSubmission,
  type ApiRegistrationPayload,
  type Gender,
  isOneDayRegistration,
  isWeekLongRegistration,
} from "../types";

export async function submitRegistration(
  formData: RegistrationSubmission,
  missionData: MissionEventDetails
): Promise<void> {
  try {
    const payload = transformFormDataToApiPayload(formData, missionData);
    await registrationApi.createParticipant(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    if (
      message.toLowerCase().includes("already registered") ||
      message.toLowerCase().includes("duplicate")
    ) {
      throw new Error("already_registered");
    }

    throw new Error(message);
  }
}

function transformFormDataToApiPayload(
  formData: RegistrationSubmission,
  missionData: MissionEventDetails
): ApiRegistrationPayload {
  const fullName = `${formData.first_name} ${formData.last_name}`.trim();
  const gender = formData.gender.toLowerCase() as Gender;

  const daysOfAttendance = isOneDayRegistration(formData)
    ? [{ day: 0, day_date: missionData.start_date }]
    : [...(formData.attending_days ?? [])].sort((a, b) => a.day - b.day);

  const comingAsCouple = isWeekLongRegistration(formData)
    ? !!formData.coming_as_couple
    : false;
  const partnerName = isWeekLongRegistration(formData)
    ? formData.partner_name ?? ""
    : "";

  const facilitationAmount = formData.support_needed
    ? Number(formData.support_needed)
    : 0;

  return {
    mission_id: Number(formData.mission_id),
    user_id: undefined,
    full_name: fullName,
    phone_number: formData.phone_number,
    travelling_from: formData.travelling_from || "",
    days_of_attendance: daysOfAttendance,
    diet_advisory: formData.dietary_watch || "",
    need_facilitation: !formData.can_pay_full,
    facilitation_amount: facilitationAmount,
    gender,
    coming_as_couple: comingAsCouple,
    partner_name: partnerName,
  };
}
