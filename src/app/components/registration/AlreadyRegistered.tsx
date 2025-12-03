"use client";

import { CheckCircle, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { CONTACT_PHONE } from "src/config/constants";


interface AlreadyRegisteredProps {
  isOpen: boolean;
  onClose: () => void;
  onTryAgain?: () => void;
  firstName: string;
  missionTitle: string;
}

export default function AlreadyRegistered({
  isOpen,
  onClose,
  onTryAgain,
  firstName,
  missionTitle,
}: AlreadyRegisteredProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 sm:max-w-md sm:p-8 shadow-2xl">
        <div className="absolute left-0 right-0 top-0 h-1.5 bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-700" />

        <DialogHeader className="relative z-10 flex flex-col items-center gap-3 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-300/50 sm:h-20 sm:w-20">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>

          <h2 className="text-xl font-bold text-emerald-800 sm:text-2xl">
            Welcome back, <span className="text-emerald-700">{firstName}!</span>
          </h2>
        </DialogHeader>

        <DialogDescription className="space-y-4 text-center text-sm leading-relaxed text-slate-600 sm:text-base">
          <p className="text-slate-700">
            You&apos;re already signed up for <strong className="text-emerald-700">{missionTitle}</strong>.
            <br className="hidden sm:block" />
            {' '}We&apos;re so excited to have you with us again!
          </p>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
            <p className="mb-1 font-semibold text-emerald-800">Think this is a mistake?</p>
            <p>
              Try a <strong>different phone number</strong> or slightly change your name (e.g. add middle name).
              <br className="sm:hidden" /> Still stuck? Call us at{' '}
              <a
                href={`tel:${CONTACT_PHONE}`}
                className="font-bold text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
              >
                {CONTACT_PHONE}
              </a>
            </p>
          </div>

          <div className="text-xs text-slate-500 sm:text-sm">
            <p>With love and gratitude,</p>
            <p className="font-bold text-emerald-700">God in Kenya Missions</p>
          </div>
        </DialogDescription>

        {/* Two buttons: Try Again + Register Someone Else */}
        <DialogFooter className="mt-6 sm:mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            onClick={onTryAgain}
            variant="outline"
            size="lg"
            className="w-full rounded-full border-emerald-600 text-emerald-700 hover:bg-emerald-50 sm:w-auto sm:flex-1"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Try Again
          </Button>

          <Button
            onClick={onClose}
            size="lg"
            className="w-full rounded-full bg-linear-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-300/40 hover:brightness-110 sm:w-auto sm:flex-1"
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Register Someone Else
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}