export type RegistrationSubmission = OneDayRegistration | WeekLongRegistration;

interface BaseRegistration {
  mission_id: number;                   
  first_name: string;
  last_name: string;
  phone_number: string;
  gender: Gender;
  travelling_from?: string;              
  dietary_watch?: string;
  can_pay_full: boolean;
  support_needed?: string;
}

export interface OneDayRegistration extends BaseRegistration {
  mission_type: "one_day";
  mission_date: string;                  
}

export interface WeekLongRegistration extends BaseRegistration {
  mission_type: "week_long";
  attending_days?: Array<{
    day: number;                         
    day_date: string;                   
  }>;
  coming_as_couple?: boolean;
  partner_name?: string;
}

export const isOneDayRegistration = (
  data: RegistrationSubmission
): data is OneDayRegistration => data.mission_type === "one_day";

export const isWeekLongRegistration = (
  data: RegistrationSubmission
): data is WeekLongRegistration => data.mission_type === "week_long";

export interface ApiRegistrationPayload {
  mission_id: number;
  user_id?: string;
  full_name: string;
  phone_number: string;
  travelling_from: string;
  days_of_attendance?: Array<{
    day: number;
    day_date: string;
  }>;
  diet_advisory?: string;
  need_facilitation: boolean;
  facilitation_amount: number;
  gender: Gender;
  coming_as_couple: boolean;
  partner_name?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface RegistrationApiResponse extends ApiResponse {
  data?: {
    registration_id: string;
    status: "pending" | "confirmed" | "cancelled";
  };
}

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "DUPLICATE_REGISTRATION"
  | "MISSION_NOT_FOUND"
  | "PAYMENT_REQUIRED"
  | "INTERNAL_SERVER_ERROR";

export interface RegistrationValidationError {
  field: keyof RegistrationSubmission;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: RegistrationValidationError[];
}

export interface FormState {
  data: Partial<RegistrationSubmission>;
  errors: Partial<Record<keyof RegistrationSubmission, string>>;
  isSubmitting: boolean;
  touched: Set<keyof RegistrationSubmission>;
}

export interface AlreadyRegisteredResponse {
  success: true;
  is_already_registered: true;
  existing_registration: {
    registration_id: string;
    registration_date: string;
  };
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  show_if?: { field: string; value: string | boolean };
}

export type Gender = "male" | "female";
export type MissionType = "one_day" | "week_long";

export interface MissionEventDetails {
  id: number;
  created_at: string; 
  updated_at: string;
  title: string;
  description: string;
  category_name: string;
  location_name: string;
  start_date: string; 
  end_date: string;
  status: 'planning' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';
  partnering_organization: string[];
  event_type: MissionType;
  registration_close_date: string;
  registration_fee_required: boolean;
  registration_fee: number; 
  couple_registration_fee: number;
  is_registration_open: boolean;
  total_souls_won: number | string; 
}

export const isOneDayMission = (
  m: MissionEventDetails
): m is MissionEventDetails & { event_type: "one_day" } => m.event_type === "one_day";

export const isWeekLongMission = (
  m: MissionEventDetails
): m is MissionEventDetails & { event_type: "week_long" } => m.event_type === "week_long";