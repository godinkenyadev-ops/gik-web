import { NextResponse } from "next/server";
import type { RegistrationSubmission } from "@/types/api";
import { MISSIONS } from "@/data/missions";
import { createReference, isValidPhone, sanitizeInput } from "@/utils/helpers";

const formatError = (message: string) => NextResponse.json({ success: false, message }, { status: 400 });

const assertMissionExists = (missionId: string) => MISSIONS.some((mission) => mission.id === missionId);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<RegistrationSubmission>;
    const payload: RegistrationSubmission = {
      mission_id: sanitizeInput(body.mission_id ?? ""),
      mission_type: body.mission_type ?? "one-day",
      first_name: sanitizeInput(body.first_name ?? ""),
      last_name: sanitizeInput(body.last_name ?? ""),
      phone_number: sanitizeInput(body.phone_number ?? ""),
      gender: body.gender ?? "Male",
      can_pay_full: body.can_pay_full ?? true,
      support_needed: body.support_needed ? sanitizeInput(body.support_needed) : undefined,
      travelling_from: body.travelling_from ? sanitizeInput(body.travelling_from) : undefined,
      coming_as_couple: body.coming_as_couple ?? false,
      partner_name: body.partner_name ? sanitizeInput(body.partner_name) : undefined,
      attending_days: body.attending_days,
      mission_date: body.mission_date,
      dietary_watch: body.dietary_watch ? sanitizeInput(body.dietary_watch) : undefined
    };

    if (!payload.mission_id || !assertMissionExists(payload.mission_id)) {
      return formatError("Invalid mission reference.");
    }

    if (!payload.first_name || !payload.last_name) {
      return formatError("First name and last name are required.");
    }

    if (!payload.phone_number || !isValidPhone(payload.phone_number)) {
      return formatError("Please provide a valid phone number.");
    }

    if (payload.can_pay_full === false && !payload.support_needed) {
      return formatError("Support amount is required when you cannot pay the full fee.");
    }

    if (payload.mission_type === "one-day" && !payload.mission_date) {
      return formatError("Mission date is required.");
    }

    if (payload.mission_type === "week-long" && (!payload.attending_days || payload.attending_days.length === 0)) {
      return formatError("Please include the days you plan to attend.");
    }

    if (payload.coming_as_couple && !payload.partner_name) {
      return formatError("Partner name is required when registering as a couple.");
    }

    const referenceId = createReference("GKM");

    return NextResponse.json({
      success: true,
      message: "Registration received! We will be in touch soon.",
      referenceId
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to process registration." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Please use POST to submit registrations." }, { status: 405 });
}
