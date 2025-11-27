export const validateSupportAmount = (
  amount: string,
  maxFee: number
): string | null => {
  if (!amount.trim()) return null;

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
  selectedDays: Array<{ day: number; day_date: string }>,
  startDate: string,
  endDate: string
): string | null => {
  if (!selectedDays || selectedDays.length === 0) {
    return "Please select at least one day.";
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const invalidDays = selectedDays.filter(({ day_date }) => {
    const date = new Date(day_date);
    const isValidDate = !Number.isNaN(date.getTime());
    const isInRange = date >= start && date <= end;
    return !isValidDate || !isInRange;
  });

  if (invalidDays.length > 0) {
    return "Some selected days are invalid or outside the mission dates.";
  }

  return null;
};

export const formatDateForDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const formatDayLabel = (
  dayIndex: number,
  dateStr: string
): string => {
  return `Day ${dayIndex + 1} – ${formatDateForDisplay(dateStr)}`;
};