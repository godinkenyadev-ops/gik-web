export type Gender = "Male" | "Female";
export type MissionType = "one-day" | "week-long";

export interface MissionDetails {
  id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  registration_close_date: string;
  registration_fee: number;
  couple_registration_fee?: number;
  registration_fee_required: boolean;
  is_individual: boolean;
  mission_type: MissionType;
  location: string;
}

export interface RegistrationSubmission {
  mission_id: string;
  mission_type: MissionType;
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: Gender;
  can_pay_full: boolean;
  support_needed?: string;
  travelling_from?: string;
  coming_as_couple?: boolean;
  partner_name?: string;
  attending_days?: string[];
  mission_date?: string;
  dietary_watch?: string;
}
