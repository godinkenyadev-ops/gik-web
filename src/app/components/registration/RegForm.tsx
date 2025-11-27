"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import type { MissionEventDetails } from "../../../types";
import { useRegistrationForm } from "src/hooks/useRegistrationForm";
import { submitRegistration } from "src/services/registrationService";
import AlreadyRegistered from "./AlreadyRegistered";
import { MissionSpecificSection, PaymentSection, PersonalInfoSection } from "./formsections";
import SuccessModal from "./SuccessModal";
import RegistrationFooter from "./RegistrationFooter";



interface RegFormProps {
  missionData: MissionEventDetails;
}

export default function RegForm({ missionData }: RegFormProps) {
  const {
    formData,
    errors,
    formRef,
    handleChange,
    resetForm,
    getSchemas,
    setErrors
  } = useRegistrationForm(missionData);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlreadyRegistered, setShowAlreadyRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedFirstName, setSubmittedFirstName] = useState<string>("");
  const [daysResetKey, setDaysResetKey] = useState(0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submit Clicked")
    setErrors({});
    setIsSubmitting(true);

    const { oneDaySchema, weekLongSchema } = getSchemas();
    const schema = missionData.event_type === "one_day" ? oneDaySchema : weekLongSchema;
    const submissionData = {
      ...formData,
      mission_id: missionData.id,
      mission_type: missionData.event_type,
      travelling_from: formData.travelling_from || ""
    };
    console.log(submissionData);
    const result = schema.safeParse(submissionData);
    console.log(result);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        const path = error.path[0] as string;
        fieldErrors[path] = error.message;
      });
      console.log(result);
      setErrors(fieldErrors);
      const firstErrorField = Object.keys(fieldErrors)[0];
      document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      setIsSubmitting(false);
      return;
    }

    try {
      const data = result.data;
      const response:any = await submitRegistration(data, missionData);
      setSubmittedFirstName(data.first_name);
      clearSelectedDays();
      setShowSuccess(true);
      console.log(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";
      console.log(result);

      if (errorMessage === "already_registered") {
        setSubmittedFirstName(result.data.first_name);
        setShowAlreadyRegistered(true);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSelectedDays = () => {
    setDaysResetKey(prev => prev + 1);
  };

  const closeSuccessModal = () => {
    setShowSuccess(false);
    resetForm();
    clearSelectedDays();
  };

const closeAlreadyRegistered = () => {
  setShowAlreadyRegistered(false);
  resetForm();
  setDaysResetKey(prev => prev + 1);
};

  if (showAlreadyRegistered) {
    return (
      <AlreadyRegistered
        firstName={submittedFirstName}
        missionTitle={missionData.title}
        onTryAgain={closeAlreadyRegistered}
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
          key={daysResetKey}
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-primary px-5 py-3 text-sm text-white sm:text-base font-semibold shadow-[0_4px_12px_rgba(0,81,63,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </button>
      </form>

      <RegistrationFooter />

      <SuccessModal 
        isOpen={showSuccess} 
        onClose={closeSuccessModal} 
        firstName={submittedFirstName || "Friend"} 
      />
    </>
  );
}