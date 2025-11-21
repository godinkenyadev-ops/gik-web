import { MissionDetails } from "../types";

export const validateSupportAmount = (
  amount: string, 
  maxFee: number
): string | null => {
  if (!amount) return null;
  
  const num = Number(amount);
  
  if (Number.isNaN(num)) {
    return "Please enter a valid amount.";
  }
  
  if (num <= 0) {
    return "Support amount must be greater than 0.";
  }
  
  if (num > maxFee) {
    return `Support amount must not exceed KES ${maxFee.toLocaleString("en-KE")}`;
  }
  
  return null;
};

export const validateAttendingDays = (
  selectedDays: string[], 
  startDate: string, 
  endDate: string
): string | null => {
  if (selectedDays.length === 0) {
    return "Please select at least one day.";
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const invalidDays = selectedDays.filter((day) => {
    const date = new Date(day);
    return Number.isNaN(date.getTime()) || date < start || date > end;
  });

  if (invalidDays.length > 0) {
    return "Some selected days fall outside the mission schedule.";
  }
  
  return null;
};

export const formatDateForDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
};