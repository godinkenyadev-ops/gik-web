import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMissionById, MISSIONS } from "@/data/missions";
import DynamicRegForm from "@/app/components/registration/DynamicRegForm";
import RegistrationClosed from "@/app/components/registration/RegistrationClosed";
import { canonicalUrl, jsonLdString, missionRegistrationJsonLd } from "@/lib/seo";
import { CalendarDays, MapPin } from "lucide-react"
import Image from "next/image";


interface RegistrationPageProps {
  params: Promise<{ missionId: string }>;
}

export async function generateStaticParams() {
  return MISSIONS.map((mission) => ({ missionId: mission.id }));
}

export async function generateMetadata({ params }: RegistrationPageProps): Promise<Metadata> {
  const { missionId } = await params;
  const mission = getMissionById(decodeURIComponent(missionId));

  if (!mission) {
    return {
      title: "Mission Not Found | God in Kenya Missions",
      description: "This mission is unavailable.",
    };
  }

  const title = `Register for ${mission.title} | God in Kenya Missions`;
  const description = mission.description ?? "Join an upcoming mission with God in Kenya Missions.";

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl(`/registration/${mission.id}`) },
    openGraph: {
      title,
      description,
      url: canonicalUrl(`/registration/${mission.id}`),
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RegistrationPage({ params }: RegistrationPageProps) {
  const { missionId } = await params;
  const mission = getMissionById(decodeURIComponent(missionId));

  if (!mission) notFound();

  const now = new Date();
  const closeDate = new Date(mission.registration_close_date);

  if (now > closeDate) {
    return <RegistrationClosed missionTitle={mission.title} />;
  }

  const missionDates =
    mission.end_date && mission.end_date !== mission.start_date
      ? `${new Date(mission.start_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })} – ${new Date(mission.end_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}`
      : new Date(mission.start_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

  return (
    <section className="min-h-screen bg-linear-to-br from-teal-50 via-emerald-50 to-orange-50 px-4 py-4 md:py-10 sm:px-0">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white shadow-[0_40px_80px_rgba(0,0,0,0.12)]">

          <div className="relative overflow-hidden rounded-t-3xl text-center border-b border-gray-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#007a5e_0%,#00513F_35%,#003d2e_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.25)_0%,transparent_70%)]" />
            <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(135deg,#ffffff_1px,transparent_1px)] bg-size-[40px_40px]" />

            <div className="relative z-10 px-4 sm:px-8 lg:px-12 pt-6 pb-6 sm:pt-8 sm:pb-8">
              <div className="flex justify-center mb-5 sm:mb-6">
                <Image
                  src="/assets/logos/GIK-Logo-White.png"
                  alt="God in Kenya Missions"
                  width={180}
                  height={180}
                  priority
                  className="h-8 md:h-12 w-auto drop-shadow-2xl transition-transform hover:scale-105"
                />
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {mission.title}
              </h1>

              {mission.description && (
                <p className="mt-2 sm:mt-3 text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                  {mission.description}
                </p>
              )}
              <div className="mt-5 flex items-center justify-center gap-6 text-white/95 text-sm sm:text-base font-medium">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-5 text-white/90" />
                  <span>{missionDates}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="size-5 text-white/90" />
                  <span>{mission.location}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="py-6 px-6 md:py-10 md:px-12">
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-primary">
              Mission Registration
            </h2>
            <p className="mt-3 text-sm md:text-base text-center text-slate-600">
              Kindly fill in your details below.
            </p>

            <div className="mt-10">
              <DynamicRegForm missionData={mission} />
            </div>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(missionRegistrationJsonLd(mission.id)),
        }}
      />
    </section>
  );
}