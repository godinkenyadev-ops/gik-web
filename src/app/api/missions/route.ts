import { NextResponse } from "next/server";
import { MISSIONS } from "@/data/missions";

export async function GET() {
  return NextResponse.json(
    { missions: MISSIONS, generatedAt: new Date().toISOString() },
    {
      headers: {
        "cache-control": "no-store"
      }
    }
  );
}

export async function POST() {
  return NextResponse.json({ message: "Mission creation is not enabled in this demo." }, { status: 405 });
}
