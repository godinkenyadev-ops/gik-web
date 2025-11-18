"use client";

import { CheckCircle } from "lucide-react";

interface AlreadyRegisteredProps {
  firstName: string;
  missionTitle: string;
  onTryAgain: () => void;
}

export default function AlreadyRegistered({ firstName, missionTitle, onTryAgain }: AlreadyRegisteredProps) {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-linear-to-br from-emerald-50 to-teal-50 p-8 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle className="h-8 w-8 text-emerald-600" />
      </div>
      <h3 className="mb-3 text-xl font-bold text-emerald-800">
        Already Registered!
      </h3>
      <p className="mb-6 text-emerald-700">
        Hi {firstName}! You're already registered for <strong>{missionTitle}</strong>. 
        We have your details on file.
      </p>      
      <button
        onClick={onTryAgain}
        className="rounded-2xl border border-emerald-600 bg-white px-6 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
      >
        Register Someone Else
      </button>
    </div>
  );
}