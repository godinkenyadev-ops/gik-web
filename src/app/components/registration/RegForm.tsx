"use client";

import { FormEvent, useState } from "react";
import type { MissionDetails } from "../../../types";
import { useRegistrationForm } from "src/hooks/useRegistrationForm";
import { submitRegistration } from "src/services/registrationService";
import AlreadyRegistered from "./AlreadyRegistered";
import { MissionSpecificSection, PaymentSection, PersonalInfoSection } from "./formsections";
import SuccessModal from "./SuccessModal";


interface RegFormProps {
  missionData: MissionDetails;
}

export default function RegForm({ missionData }: RegFormProps) {
  const {
    formData,
    errors,
    formRef,
    handleChange,
    resetForm,
    getSchemas,
    shouldShowField,
    setErrors
  } = useRegistrationForm(missionData);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedFirstName, setSubmittedFirstName] = useState<string>("");

  const isCouple = (formData as any).coming_as_couple === true;
  const displayedFee = isCouple
    ? missionData.couple_registration_fee ?? missionData.registration_fee ?? 0
    : missionData.registration_fee ?? 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const { oneDaySchema, weekLongSchema } = getSchemas();
    const schema = missionData.event_type === "one-day" ? oneDaySchema : weekLongSchema;
    const submissionData = {
      ...formData,
      mission_id: missionData.id,
      mission_type: missionData.event_type,
      travelling_from: formData.travelling_from || ""
    };
    const result = schema.safeParse(submissionData);

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
      await submitRegistration(result.data as any, missionData);
      setSubmittedFirstName(result.data.first_name);
      setShowSuccess(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";

      if (errorMessage === "already_registered") {
        setSubmittedFirstName(result.data.first_name);
        setShowAlreadyRegistered(true);
      } else {
        setErrors({ form: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
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
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        <PersonalInfoSection 
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />
        
        <MissionSpecificSection 
          formData={formData}
          errors={errors}
          onChange={handleChange}
          missionData={missionData}
        />
        
        <PaymentSection 
          formData={formData}
          errors={errors}
          onChange={handleChange}
          missionData={missionData}
        />

        {errors.form && (
          <p className="text-center text-sm text-rose-500">{errors.form}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-primary px-5 py-3 text-sm text-white sm:text-base font-semibold shadow-[0_4px_12px_rgba(0,81,63,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </button>
      </form>

      <SuccessModal 
        isOpen={showSuccess} 
        onClose={resetForm} 
        firstName={submittedFirstName || "Friend"} 
        missionTitle={missionData.title} 
      />
    </>
  );
}