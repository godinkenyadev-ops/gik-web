import type { MissionDetails, ApiRegistrationPayload } from "../types";
import { getJson, postJson } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const registrationApi = {
  async getMissionPublic(missionId: string): Promise<MissionDetails> {
    return getJson<MissionDetails>(`${API_BASE_URL}/api/missions/${missionId}/public/`);
  },

  async createParticipant(data: ApiRegistrationPayload): Promise<{ success: boolean; message: string }> {
    return postJson<{ success: boolean; message: string }, ApiRegistrationPayload >(
      `${API_BASE_URL}/api/missions/participants/create/`,
      data
    );
  },
};