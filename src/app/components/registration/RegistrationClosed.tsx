import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaSpotify,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

interface RegistrationClosedProps {
  missionTitle: string;
}

const socialLinks = [
  { platform: "Instagram", Icon: FaInstagram, url: "https://www.instagram.com/god_in_kenya_missions" },
  { platform: "Facebook", Icon: FaFacebookF, url: "https://facebook.com/GodInKenya" },
  { platform: "TikTok", Icon: FaTiktok, url: "https://www.tiktok.com/@god_in_kenya_missions" },
  { platform: "X", Icon: FaXTwitter, url: "https://x.com/GodinKenya" },
  { platform: "YouTube", Icon: FaYoutube, url: "https://youtube.com/@godinkenya" },
  { platform: "Spotify", Icon: FaSpotify, url: "https://open.spotify.com/show/14mr82Z0Wm3SSrJxgzTDqE" },
];

const brandColors: Record<string, string> = {
  Instagram: "#E4405F",
  Facebook: "#1877F2",
  TikTok: "#EE1D52",
  X: "#000000",
  YouTube: "#FF0000",
  Spotify: "#1DB954",
};

export default function RegistrationClosed({ missionTitle }: RegistrationClosedProps) {
  return (
    <section className="flex h-full items-center justify-center bg-linear-to-br from-teal-50 via-emerald-50 to-orange-50 px-4 py-10 sm:py-16">
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
            We’re sorry, registration for{" "}
            <span className="font-semibold text-primary">{missionTitle}</span> is now closed.
            Stay connected with us for upcoming missions.
          </p>
        </div>

        <div className="px-5 sm:px-6 py-8 sm:py-10">
          <p className="text-center text-slate-700 text-sm sm:text-base max-w-sm mx-auto mb-8">
            Don’t miss out on our next missions! Follow us and be the first to know about future opportunities.
          </p>

          {/* UPDATED SOCIAL ICONS SECTION */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex justify-center items-center gap-4 min-w-max px-4">
              {socialLinks.map(({ platform, Icon, url }) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center transition-all duration-300 hover:-translate-y-1"
                  title={`Follow us on ${platform}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <Icon
                      className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: brandColors[platform] || "#6B7280" }}
                    />
                  </div>
                  <span className="mt-2 text-xs font-medium text-gray-700">
                    {platform}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-4 sm:px-6 py-4 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} GIK Missions. All rights reserved.
        </div>
      </div>
    </section>
  );
}