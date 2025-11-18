import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaSpotify,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const socialLinks = [
  { platform: "Instagram", Icon: FaInstagram, url: "https://www.instagram.com/god_in_kenya_missions" },
  { platform: "Facebook", Icon: FaFacebookF, url: "https://facebook.com/GodInKenya" },
  { platform: "TikTok", Icon: FaTiktok, url: "https://www.tiktok.com/@god_in_kenya_missions" },
  { platform: "X", Icon: FaXTwitter, url: "https://x.com/GodinKenya" },
  { platform: "YouTube", Icon: FaYoutube, url: "https://youtube.com/@godinkenya" },
  { platform: "Spotify", Icon: FaSpotify, url: "https://open.spotify.com/show/14mr82Z0Wm3SSrJxgzTDqE" },
];

interface SocialLinksProps {
  variant?: "default" | "compact";
}

export default function SocialLinks({ variant = "default" }: SocialLinksProps) {
  if (variant === "compact") {
    return (
      <div className="flex flex-nowrap justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {socialLinks.map(({ platform, Icon, url }) => (
          <Link
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-9 h-9 md:w-11 md:h-11 bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 flex items-center justify-center text-xl text-gray-700 hover:text-primary transition-all duration-300 hover:scale-110 group"
          >
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Icon className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors duration-200 relative z-10" />
            <span className="sr-only">{platform}</span>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-4 min-w-max p-4">
      {socialLinks.map(({ platform, Icon, url }) => (
        <Link
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-white flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 border border-gray-200">
            <Icon className="w-5 h-5 md:w-7 md:h-7 transition-transform duration-300 group-hover:scale-110 text-gray-600 group-hover:text-primary" />
          </div>
          <span className="mt-2 text-xs font-medium text-gray-700 hidden sm:block">
            {platform}
          </span>
        </Link>
      ))}
    </div>
  );
}