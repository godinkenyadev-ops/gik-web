import type { MissionType, FormField } from "../types";

export const formTemplates: Record<MissionType, FormField[]> = {
  "one-day": [
    { name: "first_name", label: "First Name", type: "text", required: true },
    { name: "last_name", label: "Last Name", type: "text", required: true },
    { name: "phone_number", label: "Phone Number", type: "text", required: true },
    { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"], required: true },
    { name: "mission_date", label: "Mission Date", type: "date" },
    { name: "can_pay_full", label: "Can pay the full amount?", type: "select", options: ["Yes", "No"], required: true },
    {
      name: "support_needed",
      label: "Support needed (Amount)",
      type: "text",
      required: true,
      show_if: { field: "can_pay_full", value: false }
    },
    { name: "travelling_from", label: "Travelling From", type: "text", required: true }
  ],
  "week-long": [
    { name: "first_name", label: "First Name", type: "text", required: true },
    { name: "last_name", label: "Last Name", type: "text", required: true },
    { name: "phone_number", label: "Phone Number", type: "text", required: true },
    { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"], required: true },
    { name: "coming_as_couple", label: "Coming as a couple?", type: "checkbox" },
    {
      name: "partner_name",
      label: "Partner's Full Name",
      type: "text",
      required: true,
      show_if: { field: "coming_as_couple", value: true }
    },
    { name: "attending_days", label: "Days you will attend", type: "days-multi-select", required: true, options: [] },
    { name: "travelling_from", label: "Travelling From", type: "text", required: true },
    { name: "can_pay_full", label: "Can pay the full amount?", type: "select", options: ["Yes", "No"], required: true },
    {
      name: "support_needed",
      label: "Support needed (Amount)",
      type: "text",
      required: true,
      show_if: { field: "can_pay_full", value: false }
    },
    { name: "dietary_watch", label: "Dietary Restrictions", type: "text" }
  ]
};