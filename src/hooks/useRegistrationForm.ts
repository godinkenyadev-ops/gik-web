import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import {
  type Gender,
  type MissionDetails,
  type RegistrationSubmission,
  isWeekLongRegistration,
} from "../types";
import { formTemplates } from "src/config/formTemplates";

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  show_if?: { field: string; value: string | boolean };
}

export function useRegistrationForm(missionData: MissionDetails) {
  const [formData, setFormData] = useState<Partial<RegistrationSubmission>>({
    mission_id: missionData.id,
    mission_type: missionData.event_type,
    can_pay_full: true,
  });

  const [fields, setFields] = useState<FormField[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [canPayFullDisplay, setCanPayFullDisplay] = useState<"Yes" | "No">("Yes");
  const formRef = useRef<HTMLFormElement>(null);

  const generateDaysArray = (start: string, end: string): string[] => {
    const days: string[] = [];
    let current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      days.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const sanitizeName = (v: string) => v.replace(/[^a-zA-Z\s'.-]/g, "").replace(/\s+/g, " ").trim().slice(0, 25);
  const sanitizePhone = (v: string) => v.replace(/\D/g, "").slice(0, 10);
  const sanitizeLocation = (v: string) => v.replace(/[^a-zA-Z0-9\s.,/\-()&]/g, "").slice(0, 25);
  const sanitizeText = (v: string) => v.slice(0, 500);
  const sanitizeAmount = (v: string) => v.replace(/[^0-9]/g, "");

  const resetForm = () => {
    setFormData({
      mission_id: missionData.id,
      mission_type: missionData.event_type,
      can_pay_full: true,
    });
    setCanPayFullDisplay("Yes");
    setErrors({});
    formRef.current?.reset();
  };

  useEffect(() => {
    // Determine mission type based on multiple criteria
    const hasEndDate = missionData.end_date && missionData.end_date !== missionData.start_date;
    const eventType = (missionData as any).event_type;
    
    console.log("Mission Data:", missionData);
    console.log("Event Type:", eventType);
    console.log("Has End Date:", hasEndDate);
    
    // Check if it's a week_long mission based on event_type or having different start/end dates
    const missionType = (eventType === "week_long" || eventType === "week_long" || eventType === "retreat" || hasEndDate) ? "week_long" : "one-day";
    
    console.log("Determined Mission Type:", missionType);
    
    const template = formTemplates[missionType] ? [...formTemplates[missionType]] : [...formTemplates["one-day"]];

    if (missionType === "week_long" && missionData.end_date) {
      const idx = template.findIndex(f => f.name === "attending_days");
      if (idx !== -1) {
        template[idx].options = generateDaysArray(missionData.start_date, missionData.end_date);
      }
    }

    setFields(template);
  }, [missionData]);

  const getSchemas = () => {
    const base = z.object({
      mission_id: z.string().min(1),
      first_name: z.string().min(2).max(25),
      last_name: z.string().min(2).max(25),
      phone_number: z.string().length(10).regex(/^\d{10}$/),
      gender: z.enum(["Male", "Female"]),
      travelling_from: z.string().optional(),
      dietary_watch: z.string().optional(),
      can_pay_full: z.boolean(),
      support_needed: z.string().optional(),
    });

    const oneDay = base.extend({
      mission_type: z.literal("one-day"),
      mission_date: z.string().min(1),
    });

    const weekLong = base.extend({
      mission_type: z.literal("week_long"),
      attending_days: z.array(z.string()).min(1, "Select at least one day"),
      coming_as_couple: z.boolean().optional(),
      partner_name: z.string().optional(),
    });

    return { oneDaySchema: oneDay, weekLongSchema: weekLong };
  };

  const handleChange = (
    name: string,
    value: string | boolean | string[]
  ) => {
    setErrors(prev => {
      const { [name]: _, ...rest } = prev;
      return rest;
    });

    setFormData(prev => {
      const updated: Partial<RegistrationSubmission> = { ...prev };

      // Common fields
      if (name === "first_name" || name === "last_name") {
        updated[name] = sanitizeName(value as string);
      } else if (name === "phone_number") {
        updated.phone_number = sanitizePhone(value as string);
      } else if (name === "travelling_from") {
        updated.travelling_from = sanitizeLocation(value as string);
      } else if (name === "dietary_watch") {
        updated.dietary_watch = sanitizeText(value as string);
      } else if (name === "support_needed") {
        updated.support_needed = sanitizeAmount(value as string);
      } else if (name === "gender") {
        updated.gender = value as Gender;
      } else if (name === "can_pay_full") {
        const bool = typeof value === "string" ? value === "Yes" : !!value;
        updated.can_pay_full = bool;
        setCanPayFullDisplay(bool ? "Yes" : "No");
        if (bool) delete (updated as any).support_needed;
      }

      // Only allow week_long fields if this is a week_long mission
      const hasEndDate = missionData.end_date && missionData.end_date !== missionData.start_date;
      const eventType = (missionData as any).event_type;
      const isWeekLong = eventType === "week_long" || eventType === "week_long" || hasEndDate;
      
      if (isWeekLong) {
        if (name === "coming_as_couple") {
          (updated as any).coming_as_couple = value as boolean;
          if (!value) delete (updated as any).partner_name;
        } else if (name === "partner_name") {
          (updated as any).partner_name = sanitizeName(value as string);
        } else if (name === "attending_days") {
          (updated as any).attending_days = value as string[];
        }
      }

      return updated;
    });
  };

  const shouldShowField = (field: FormField): boolean => {
    if (!field.show_if) return true;
    return (formData as any)[field.show_if.field] === field.show_if.value;
  };

  return {
    formData,
    fields,
    errors,
    canPayFullDisplay,
    formRef,
    handleChange,
    resetForm,
    getSchemas,
    shouldShowField,
    setErrors,
  };
}