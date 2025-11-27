"use client";

import { IoCheckmarkCircle } from "react-icons/io5";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "../ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  firstName: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  firstName,
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-8 sm:p-10 shadow-2xl">

        <div className="absolute left-0 right-0 top-0 h-2 bg-linear-to-r from-primary via-emerald-500 to-emerald-700" />

        <DialogHeader className="relative z-10 flex flex-col items-center py-2 gap-6 text-center">
          
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-300 opacity-60" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-emerald-600 to-emerald-700 text-white shadow-xl shadow-emerald-300/40">
              <IoCheckmarkCircle className="h-14 w-14 animate-pulse drop-shadow-md" />
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <p className="text-xl font-semibold text-emerald-700">
              Registration Successful
            </p>
            <DialogTitle className="bg-linear-to-r from-emerald-700 to-emerald-600 bg-clip-text text-lg font-extrabold tracking-tight text-transparent sm:text-4xl">
              Thank you, {firstName}!
            </DialogTitle>
            
          </div>
        </DialogHeader>
        <DialogDescription className="mt-2 space-y-4 text-center text-base leading-relaxed text-slate-600">
          <p>
            We are overjoyed to have you join us in spreading the Gospel
            and proclaiming the goodness of our Lord Jesus Christ!
          </p>

          <div className="pt-3">
            <p className="text-sm text-slate-500">With love and gratitude,</p>
            <p className="font-bold text-emerald-700">
              God in Kenya Missions
            </p>
          </div>
        </DialogDescription>
        <DialogFooter className="mt-8">
          <div className="flex w-full justify-center">
            <Button
              onClick={onClose}
              size="lg"
              className="group relative overflow-hidden rounded-full bg-linear-to-r from-primary to-emerald-700 px-10 py-6 text-lg font-bold text-white shadow-lg shadow-emerald-300/40 transition-all duration-300 hover:brightness-110 hover:shadow-xl focus-visible:ring-4 focus-visible:ring-emerald-300"
            >
              <span className="relative z-10 flex items-center gap-3 ">
                <IoCheckmarkCircle className="h-8 w-8 md:h-10 md:w-10 transition-transform group-hover:scale-110" />
                Praise God! I&apos;m Ready
              </span>
              <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
            </Button>
          </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
