import Image from "next/image";
import SocialLinks from "../ui/SocialLinks";

interface RegistrationClosedProps {
  missionTitle: string;
}


export default function RegistrationClosed({ missionTitle }: RegistrationClosedProps) {

  return (
    <section className="flex min-h-screen items-center justify-center bg-linear-to-br from-teal-50 via-emerald-50 to-orange-50 px-4 py-10 sm:py-16">
      <div className="w-full max-w-lg sm:max-w-3xl mx-auto overflow-hidden rounded-3xl border border-slate-100 bg-white/95 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
        <div className="border-b border-rose-100 bg-linear-to-r from-rose-50 to-red-50 px-5 sm:px-6 py-8 sm:py-10 text-center">
          <div className="mx-auto mb-5 sm:mb-6 flex items-center justify-center">
            <Image
              src="/assets/logos/GIK-Black-Green.png"
              alt="God in Kenya Missions"
              width={180}
              height={180}
              priority
              className="h-10 md:h-12 w-auto drop-shadow-2xl transition-transform hover:scale-105"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Registration Closed</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 px-2">
            We&apos;re sorry, registration for{" "}
            <span className="font-semibold text-primary">{missionTitle}</span> is now closed.
            Stay connected with us for upcoming missions.
          </p>
        </div>

        <div className="px-5 sm:px-6 py-8 sm:py-10">
          <p className="text-center text-slate-700 text-sm sm:text-base max-w-sm mx-auto mb-8">
            Follow us and be the first to know of upcoming missions.
          </p>

          <div className="overflow-x-auto scrollbar-hide">
            <SocialLinks />
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-4 sm:px-6 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} GIK Missions. All rights reserved.
        </div>
      </div>
    </section>
  );
}