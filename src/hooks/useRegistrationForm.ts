import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import {
  type Gender,
  type MissionEventDetails,
  type RegistrationSubmission,
  type WeekLongRegistration,
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

export function useRegistrationForm(missionData: MissionEventDetails) {
  const [formData, setFormData] = useState<Partial<RegistrationSubmission>>({
    mission_id: Number(missionData.id),
    mission_type: missionData.event_type === "week_long" ? "week_long" : undefined,
    can_pay_full: true,
    attending_days: [],
  });

  const [fields, setFields] = useState<FormField[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [canPayFullDisplay, setCanPayFullDisplay] = useState<"Yes" | "No">("Yes");
  const formRef = useRef<HTMLFormElement>(null);

  const generateDaysArray = (start: string, end: string): string[] => {
    const days: string[] = [];
    const current = new Date(start);
    const endDate = new Date(end);
    while (current <= endDate) {
      days.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const sanitizeName = (v: string) => v.replace(/[^a-zA-Z\s'.-]/g, "").replace(/\s+/g, " ").slice(0, 25);
  const sanitizePhone = (v: string) => v.replace(/\D/g, "").slice(0, 10);
  const sanitizeLocation = (v: string) => v.replace(/[^a-zA-Z0-9\s.,/\-()&]/g, "").slice(0, 25);
  const sanitizeText = (v: string) => v.slice(0, 500);
  const sanitizeAmount = (v: string) => v.replace(/[^0-9]/g, "");

  const resetForm = () => {
    const initialFormData: Partial<RegistrationSubmission> = {
      mission_id: Number(missionData.id),
      mission_type: missionData.event_type === "week_long" ? "week_long" as const : undefined,
      can_pay_full: true,
      attending_days: [],
    };
    setFormData(initialFormData);
    setCanPayFullDisplay("Yes");
    setErrors({});
    formRef.current?.reset();
  };

  useEffect(() => {
    const isWeekLong = missionData.event_type === "week_long" ||
      (missionData.end_date && missionData.end_date !== missionData.start_date);

    const missionTypeKey = isWeekLong ? "week_long" : "one_day";

    const template = formTemplates[missionTypeKey]
      ? [...formTemplates[missionTypeKey]]
      : [...formTemplates["one_day"]];

    if (isWeekLong && missionData.end_date) {
      const idx = template.findIndex(f => f.name === "attending_days");
      if (idx !== -1) {
        template[idx].options = generateDaysArray(missionData.start_date, missionData.end_date);
      }
    }

    setFields(template);
  }, [missionData]);

  const getSchemas = () => {
    const base = z.object({
      mission_id: z.number(),
      first_name: z.string().min(2).max(25).regex(/^[a-zA-Z\s'.-]+$/, "Only letters, spaces, apostrophes, periods, and hyphens allowed"),
      surname: z.string().min(2).max(25).regex(/^[a-zA-Z\s'.-]+$/, "Only letters, spaces, apostrophes, periods, and hyphens allowed"),
      phone_number: z.string().length(10).regex(/^\d{10}$/),
      gender: z.enum(["male", "female"] as const),
      travelling_from: z.string().optional(),
      dietary_watch: z.string().optional(),
      can_pay_full: z.boolean(),
      support_needed: z.string().optional(),
    });
  
    const oneDaySchema = base.extend({
      mission_type: z.literal("one_day"),
      mission_date: z.string().min(1, "Mission date is required"),
    });
  
    const weekLongSchema = base.extend({
      mission_type: z.literal("week_long"),
      attending_days: z
        .array(
          z.object({
            day: z.number().int().min(0),
            day_date: z.string().date(),
          })
        )
        .min(1, "Please select at least one day")
        .refine((days) => {
          const daySet = new Set(days.map(d => d.day));
          return daySet.size === days.length;
        }, {
          message: "You selected the same day multiple times",
        }),
      coming_as_couple: z.boolean().optional(),
      partner_name: z.string().optional(),
    });
  
    return { oneDaySchema, weekLongSchema };
  };

  const handleChange = (
    name: string,
    value: string | boolean | string[]
  ) => {
    setErrors(prev => {
      const { [name]: _, ...updated } = prev;
      return updated;
    });

    setFormData(prev => {
      const updated: Partial<RegistrationSubmission> = { ...prev };

      if (name === "first_name" || name === "surname") {
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
        if (bool) {
          delete updated.support_needed;
        }
      }

      const hasEndDate = missionData.end_date && missionData.end_date !== missionData.start_date;
      const isWeekLong = missionData.event_type === "week_long" || hasEndDate;
      
      if (isWeekLong && updated.mission_type === "week_long") {
        const weekLongData = updated as Partial<WeekLongRegistration>;
        
        if (name === "coming_as_couple") {
          weekLongData.coming_as_couple = value as boolean;
          if (!value) {
            delete weekLongData.partner_name;
          }
        } else if (name === "partner_name") {
          weekLongData.partner_name = sanitizeName(value as string);
        } else if (name === "attending_days" && Array.isArray(value)) {
          weekLongData.attending_days = value as unknown as WeekLongRegistration["attending_days"];
        }
      }

      return updated;
    });
  };

  const shouldShowField = (field: FormField): boolean => {
    if (!field.show_if) return true;
    
    const fieldValue = formData[field.show_if.field as keyof Partial<RegistrationSubmission>];
    return fieldValue === field.show_if.value;
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