const DEFAULT_SITE_URL = "https://www.godinkenya.org" as const;

type JsonLd = Record<string, unknown>;

const sanitizeUrl = (url: string): string => {
  try {
    const normalized = new URL(url.trim());
    normalized.pathname = normalized.pathname.replace(/\/$/, "");
    return normalized.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
};

export const getSiteUrl = (): string => {
  const envValue = process.env.NEXT_PUBLIC_SITE_URL;
  if (!envValue) {
    return DEFAULT_SITE_URL;
  }
  return sanitizeUrl(envValue);
};

export const canonicalUrl = (path = "/"): string => {
  const url = new URL(path, `${getSiteUrl()}/`);
  return url.toString();
};

export const organizationJsonLd = (): JsonLd => ({
  "@context": "https://godinkenyamissions.org",
  "@type": "Organization",
  name: "God in Kenya Missions",
  url: getSiteUrl(),
  logo: `${getSiteUrl()}/logo.png`,
  sameAs: [
    "https://facebook.com/GodInKenya",
    "https://www.instagram.com/god_in_kenya_missions",
    "https://x.com/GodinKenya",
    "https://www.tiktok.com/@god_in_kenya_missions",
    "https://youtube.com/@godinkenya",
    "https://open.spotify.com/show/14mr82Z0Wm3SSrJxgzTDqE"
  ],
  description: "A ministry founded on the desire to see the Gospel preached with great power so that people's faith is established in the power of God.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "info@godinkenyamissions.org"
  }
});

export const missionRegistrationJsonLd = (missionId: string): JsonLd => ({
  "@context": "https://schema.org",
  "@type": "RegisterAction",
  agent: {
    "@type": "Person",
    name: "Mission Volunteer"
  },
  object: {
    "@type": "Event",
    name: `Mission Registration ${missionId}`,
    url: canonicalUrl(`/registration/${missionId}`)
  },
  target: {
    "@type": "EntryPoint",
    urlTemplate: canonicalUrl(`/registration/${missionId}`),
    actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"],
    httpMethod: "POST"
  },
  result: {
    "@type": "Thing",
    name: "Registration Confirmation"
  }
});

export const jsonLdString = (data: JsonLd): string => JSON.stringify(data, null, 2);
