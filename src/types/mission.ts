export type Gender = "male" | "female";
export type MissionType = "one_day" | "week_long";

export interface MissionDetails {
  id: string;
  title: string;
  description: string;
  event_type: MissionType;
  start_date: string;                
  end_date?: string;                    
  registration_fee: number;
  couple_registration_fee?: number;
  registration_fee_required: boolean;
}

export const isOneDayMission = (
  m: MissionDetails
): m is MissionDetails & { mission_type: "one_day" } => m.event_type === "one_day";

export const isWeekLongMission = (
  m: MissionDetails
): m is MissionDetails & { mission_type: "week_long" } => m.event_type === "week_long";