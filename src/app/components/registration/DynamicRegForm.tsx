"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { postJson } from "@/lib/api";
import type { Gender, MissionDetails, MissionType, RegistrationSubmission } from "@/types/api";
import SuccessModal from "./SuccessModal";
import AlreadyRegistered from "./AlreadyRegistered";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/app/lib/utils";
import { Checkbox } from "../ui/checkbox";

interface FormField {
  name: keyof RegistrationSubmission;
  label: string;
  type: "text" | "select" | "date" | "checkbox" | "days-multi-select";
  required?: boolean;
  options?: string[];
  show_if?: { field: keyof RegistrationSubmission; value: string | boolean };
}

const generateDaysArray = (startDate: string, endDate: string): string[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    days.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return days;
};

const formatDateForDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
};

const FORM_TEMPLATES: Record<MissionType, FormField[]> = {
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
    { name: "travelling_from", label: "Travelling From", type: "text", required: true  }
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

interface DynamicRegFormProps {
  missionData: MissionDetails;
}

export default function DynamicRegForm({ missionData }: DynamicRegFormProps) {
  const [formData, setFormData] = useState<Partial<RegistrationSubmission>>({});
  const [fields, setFields] = useState<FormField[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [canPayFullDisplay, setCanPayFullDisplay] = useState("Yes");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedFirstName, setSubmittedFirstName] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const isCouple = formData.coming_as_couple === true;
  const displayedFee = isCouple
    ? missionData.couple_registration_fee ?? missionData.registration_fee ?? 0
    : missionData.registration_fee ?? 0;

  const resetForm = () => {
    setFormData({
      mission_id: missionData.id,
      mission_type: missionData.mission_type,
      can_pay_full: true,
      coming_as_couple: false,
      mission_date: missionData.mission_type === "one-day" ? missionData.start_date : undefined
    });
    setCanPayFullDisplay("Yes");
    setErrors({});
    setShowSuccess(false);
    setShowAlreadyRegistered(false);
    setSubmittedFirstName("");
    formRef.current?.reset();
  };

  useEffect(() => {
    const template = [...FORM_TEMPLATES[missionData.mission_type]];

    if (missionData.mission_type === "week-long" && missionData.end_date) {
      const attendingDaysIndex = template.findIndex((field) => field.name === "attending_days");
      if (attendingDaysIndex !== -1) {
        template[attendingDaysIndex].options = generateDaysArray(missionData.start_date, missionData.end_date);
      }
    }

    setFields(template);

    setFormData({
      mission_id: missionData.id,
      mission_type: missionData.mission_type,
      can_pay_full: true,
      coming_as_couple: false,
      mission_date: missionData.mission_type === "one-day" ? missionData.start_date : undefined
    });

    setCanPayFullDisplay("Yes");
    setErrors({});
  }, [missionData]);

  const sanitizeName = (value: string): string => {
    let cleaned = value.replace(/[^a-zA-Z\s'.-]/g, "");
    cleaned = cleaned.replace(/\s+/g, " ").trim();
    cleaned = cleaned.replace(/([.'-]){3,}/g, (match) => match.slice(0, 2));
    return cleaned.slice(0, 25);
  };

  const sanitizePhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    return digits.slice(0, 10);
  };

  const sanitizeLocation = (value: string): string => value.replace(/[^a-zA-Z0-9\s.,/\-()&]/g, "").slice(0, 25);
  const sanitizeTextArea = (value: string): string => value.slice(0, 500);
  const sanitizeAmount = (value: string): string => value.replace(/[^0-9]/g, "").slice(0, 9);

  const nameRegex = /^(?=(?:.*[a-zA-Z]){2})[a-zA-Z\s'.-]*([.'-][.'-]?)?[a-zA-Z\s'.-]*$/;
  const nameErrorMsg =
    "Name must contain at least 2 letters and may only contain letters, spaces, periods, hyphens, and apostrophes.";

  const getSchemas = () => {
    const baseSchema = z.object({
      mission_id: z.string().min(1, "Mission reference is required"),
      mission_type: z.enum(["one-day", "week-long"] as [MissionType, MissionType]),
      first_name: z.string().min(2, "First name must be at least 2 characters").max(25).regex(nameRegex, nameErrorMsg),
      last_name: z.string().min(2, "Last name must be at least 2 characters").max(25).regex(nameRegex, nameErrorMsg),
      phone_number: z
        .string()
        .length(10, "Phone number must be exactly 10 digits")
        .regex(/^[0-9]{10}$/u, "Phone number must contain digits only"),
      gender: z.enum(["Male", "Female"], { required_error: "Please select a gender" }),
      can_pay_full: z.boolean(),
      support_needed: z
        .string()
        .optional()
        .or(z.literal(""))
        .refine((value) => !value || /^\d+$/.test(value), {
          message: "Support amount must contain numbers only"
        })
        .refine((value) => !value || Number(value) > 0, {
          message: "Support amount must be greater than 0"
        })
        .refine((value) => !value || Number(value) <= displayedFee, {
          message: `Support amount must not exceed the registration fee (KES ${displayedFee.toLocaleString("en-KE")})`
        }),
      travelling_from: z.string().or(z.literal("")),
      coming_as_couple: z.boolean().optional(),
      partner_name: z.string().optional().or(z.literal("")),
      attending_days: z.array(z.string()).optional(),
      mission_date: z.string().optional(),
      dietary_watch: z.string().optional().or(z.literal(""))
    });

    const oneDaySchema = baseSchema
      .extend({
        mission_date: z.string().min(1, "Mission date is required")
      })
      .refine(
        (data) =>
          data.can_pay_full === true || (data.support_needed && data.support_needed.trim() && Number(data.support_needed) > 0),
        {
          message: "Support amount is required and must be greater than 0 when you cannot pay the full amount",
          path: ["support_needed"]
        }
      );

    const weekLongSchema = baseSchema
      .extend({
        attending_days: z.array(z.string()).min(1, "Please select at least one day"),
        dietary_watch: z.string().max(500, "Dietary restrictions must not exceed 500 characters").optional().or(z.literal(""))
      })
      .refine((data) => (data.coming_as_couple ? Boolean(data.partner_name && data.partner_name.trim()) : true), {
        message: "Partner name is required when coming as a couple",
        path: ["partner_name"]
      })
      .refine(
        (data) =>
          data.can_pay_full === true || (data.support_needed && data.support_needed.trim() && Number(data.support_needed) > 0),
        {
          message: "Support amount is required and must be greater than 0 when you cannot pay the full amount",
          path: ["support_needed"]
        }
      );

    return { oneDaySchema, weekLongSchema };
  };

  const handleChange = (name: keyof RegistrationSubmission, value: string | boolean) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });

    setFormData((prev) => {
      const updated: Partial<RegistrationSubmission> = { ...prev };

      switch (name) {
        case "mission_id":
          updated.mission_id = value as string;
          break;
        case "first_name":
          updated.first_name = sanitizeName(value as string);
          break;
        case "last_name":
          updated.last_name = sanitizeName(value as string);
          break;
        case "phone_number":
          updated.phone_number = sanitizePhoneNumber(value as string);
          break;
        case "gender":
          updated.gender = value as Gender;
          break;
        case "can_pay_full":
          if (typeof value === "string") {
            const boolValue = value === "Yes";
            updated.can_pay_full = boolValue;
            setCanPayFullDisplay(value);
          } else {
            updated.can_pay_full = value;
            setCanPayFullDisplay(value ? "Yes" : "No");
          }
          break;
        case "support_needed":
          updated.support_needed = sanitizeAmount(value as string);
          break;
        case "travelling_from":
          updated.travelling_from = sanitizeLocation(value as string);
          break;
        case "coming_as_couple":
          updated.coming_as_couple = value as boolean;
          break;
        case "partner_name":
          updated.partner_name = sanitizeName(value as string);
          break;
        case "attending_days":
          if (typeof value === "string") {
            updated.attending_days = value.split(",").filter(Boolean);
          }
          break;
        case "mission_date":
          updated.mission_date = value as string;
          break;
        case "dietary_watch":
          updated.dietary_watch = sanitizeTextArea(value as string);
          break;
      }

      return updated;
    });

    if (name === "support_needed" && typeof value === "string" && value) {
      const num = Number(value);
      if (Number.isNaN(num)) {
        setErrors((prev) => ({ ...prev, support_needed: "Please enter a valid amount." }));
      } else if (num <= 0) {
        setErrors((prev) => ({ ...prev, support_needed: "Support amount must be greater than 0." }));
      } else if (num > displayedFee) {
        setErrors((prev) => ({ ...prev, support_needed: `Support amount must not exceed KES ${displayedFee.toLocaleString("en-KE")}` }));
      }
    }

    if (name === "attending_days" && missionData.mission_type === "week-long" && typeof value === "string") {
      const selectedDays = value.split(",").filter(Boolean);

      if (selectedDays.length === 0) {
        setErrors((prev) => ({ ...prev, attending_days: "Please select at least one day." }));
      } else if (missionData.end_date) {
        const start = new Date(missionData.start_date);
        const end = new Date(missionData.end_date);
        const invalidDays = selectedDays.filter((day) => {
          const date = new Date(day);
          return Number.isNaN(date.getTime()) || date < start || date > end;
        });

        if (invalidDays.length > 0) {
          setErrors((prev) => ({ ...prev, attending_days: "Some selected days fall outside the mission schedule." }));
        }
      }
    }
  };

  const shouldShowField = (field: FormField): boolean => {
    if (!field.show_if) return true;
    return formData[field.show_if.field] === field.show_if.value;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const { oneDaySchema, weekLongSchema } = getSchemas();
    const schema = missionData.mission_type === "one-day" ? oneDaySchema : weekLongSchema;
    const result = schema.safeParse({ ...formData, mission_id: missionData.id, mission_type: missionData.mission_type });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        const path = error.path[0] as string;
        fieldErrors[path] = error.message;
      });
      setErrors(fieldErrors);
      const firstErrorField = Object.keys(fieldErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      setIsSubmitting(false);
      return;
    }

    try {
      await postJson("/api/register", {
        ...result.data,
        mission_id: missionData.id,
        mission_type: missionData.mission_type
      });
      setSubmittedFirstName(result.data.first_name);
      setShowSuccess(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";

      if (errorMessage.toLowerCase().includes("already registered") || errorMessage.toLowerCase().includes("duplicate")) {
        setSubmittedFirstName(result.data.first_name);
        setShowAlreadyRegistered(true);
      } else {
        setErrors({ form: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCharacterCount = (field: keyof RegistrationSubmission, max: number) => {
    const value = (formData[field] as string) ?? "";
    return `${value.length}/${max}`;
  };

  if (showAlreadyRegistered) {
    return (
      <AlreadyRegistered
        firstName={submittedFirstName}
        missionTitle={missionData.title}
        onTryAgain={resetForm}
      />
    );
  }

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {fields.map((field) =>
          shouldShowField(field) ? (
            <div key={field.name} className="space-y-2">
              <label className="flex items-center gap-1 text-sm font-semibold text-slate-800">
                {field.label}
                {field.required && <span className="text-rose-500">*</span>}
              </label>

              {field.type === "select" && field.name !== "attending_days" ? (
                <Select
                  value={
                    field.name === "can_pay_full"
                      ? canPayFullDisplay
                      : String(formData[field.name] ?? "")
                  }
                  onValueChange={(value) => handleChange(field.name, value)}
                >
                  <SelectTrigger
                    className={cn(
                      "h-11 sm:h-12 w-full rounded-2xl border px-4 py-3 text-base text-slate-900 shadow-sm bg-white transition-all",
                      "focus:ring-2 focus:ring-primary/20 focus:border-primary",
                      errors[field.name] ? "border-rose-400 animate-[shake_0.3s]" : "border-slate-200"
                    )}
                  >
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>

                  <SelectContent className="rounded-2xl border border-slate-200 bg-white shadow-lg">
                    {field.options?.map((option) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="cursor-pointer rounded-xl px-3 py-2 text-slate-800 hover:bg-primary/10 hover:text-primary transition"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "days-multi-select" ? (
                <div className="space-y-3">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-primary/30 px-3 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wide"
                    onClick={() => {
                      const options = field.options ?? [];
                      const allSelected =
                        options.length > 0 &&
                        (formData.attending_days ?? []).length === options.length;

                      const nextDays = allSelected ? [] : options;
                      handleChange(field.name, nextDays.join(","));
                    }}
                  >
                    {field.options &&
                      (formData.attending_days ?? []).length === field.options.length
                      ? "Clear all days"
                      : "Select all days"}
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {field.options?.map((day) => {
                      const isSelected = (formData.attending_days ?? []).includes(day);

                      return (
                        <label
                          key={day}
                          className={cn(
                            "flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 sm:py-4 transition-all",
                            "hover:border-emerald-500 hover:bg-emerald-50",
                            isSelected &&
                            "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-500/50"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => {
                                const current = formData.attending_days ?? [];
                                const next = checked
                                  ? [...current, day]
                                  : current.filter((d) => d !== day);

                                handleChange(field.name, next.join(","));
                              }}
                              className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 data-[state=checked]:text-white"
                            />

                            <span className="text-slate-800 font-medium">
                              {formatDateForDisplay(day)}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ) : field.type === "checkbox" ? (
                <label className="flex items-center gap-3">
                  <Checkbox
                    id={field.name}
                    checked={(formData[field.name] as boolean) ?? false}
                    onCheckedChange={(value) => handleChange(field.name, Boolean(value))}
                    className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 data-[state=checked]:text-white"
                  />
                  <span className="text-slate-800">{field.label}</span>
                  {field.required && <span className="text-rose-500">*</span>}
                </label>
              ) : field.name === "dietary_watch" ? (
                <div>
                  <textarea
                    name={field.name}
                    required={field.required}
                    rows={4}
                    value={(formData[field.name] as string) ?? ""}
                    onChange={(event) =>
                      handleChange(field.name, event.target.value)
                    }
                    maxLength={500}
                    className={`w-full rounded-2xl border px-4 py-2.5 text-sm sm:text-base text-slate-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors[field.name] ? "border-rose-400" : ""
                      }`}
                    placeholder="List any dietary restrictions or allergies..."
                  />

                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    {errors[field.name] && (
                      <p className="text-rose-500">{errors[field.name]}</p>
                    )}
                    <p>{getCharacterCount(field.name, 500)}</p>
                  </div>
                </div>
              ) : field.type === "date" ? (
                missionData.mission_type === "one-day" ? (
                  <div className="flex h-11 sm:h-12 items-center justify-between rounded-2xl border border-slate-200 bg-gray-50/80 px-4 text-base shadow-sm backdrop-blur-sm">
                    <span className="font-medium text-slate-800">
                      {formatDateForDisplay(missionData.start_date)}
                    </span>

                  </div>
                ) : (
                  <Input
                    type="date"
                    name={field.name}
                    required={field.required}
                    value={(formData[field.name] as string) ?? ""}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    min={missionData.start_date}
                    max={missionData.end_date || missionData.start_date}
                    className={cn(
                      "h-11 sm:h-12 w-full rounded-2xl border px-4 text-base text-slate-900 shadow-sm bg-white transition-all",
                      "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                      errors[field.name] ? "border-rose-400" : "border-slate-200"
                    )}
                  />
                )
              ) : (
                <Input
                  type="text"
                  name={field.name}
                  required={field.required}
                  value={(formData[field.name] as string) ?? ""}
                  onChange={(event) =>
                    handleChange(field.name, event.target.value)
                  }
                  placeholder={
                    field.name === "phone_number"
                      ? "0712345678"
                      : field.name === "travelling_from"
                        ? "City"
                        : undefined
                  }
                  inputMode={field.name === "phone_number" ? "numeric" : undefined}
                  maxLength={field.name === "phone_number" ? 10 : undefined}
                  className={cn(
                    "h-11 sm:h-12 w-full rounded-2xl border px-4 text-base text-slate-900 shadow-sm bg-white transition-all",
                    "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                    errors[field.name] ? "border-rose-400" : "border-slate-200"
                  )}
                />
              )}
              {errors[field.name] && field.name !== "dietary_watch" && (
                <p className="text-sm text-rose-500">{errors[field.name]}</p>
              )}
            </div>
          ) : null
        )}
        {missionData.registration_fee_required && displayedFee > 0 && (
          <div className="rounded-3xl border border-emerald-100 bg-linear-to-r from-emerald-50 to-teal-50 px-5 py-4 text-center text-base font-semibold text-primary">
            Registration fee: KES {displayedFee.toLocaleString("en-KE")}{" "}
            {isCouple && "(couple)"}
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

        {errors.form && (
          <p className="text-center text-sm text-rose-500">{errors.form}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-primary px-5 py-3 text-sm text-white sm:text-base font-semibold shadow-[0_4px_12px_rgba(0,81,63,0.25)] transition-all duration-30 hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0
                      disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </button>

      </form>

      <SuccessModal isOpen={showSuccess} onClose={resetForm} firstName={submittedFirstName || "Friend"} missionTitle={missionData.title} />
    </>
  );
}
