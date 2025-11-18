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
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "God in Kenya Missions",
  url: getSiteUrl(),
  logo: `${getSiteUrl()}/logo.png`,
  sameAs: [
    "https://www.facebook.com/godinkenya",
    "https://www.instagram.com/godinkenya",
    "https://twitter.com/godinkenya"
  ],
  description: "Faith-driven nonprofit empowering communities across Kenya.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "hello@godinkenya.org"
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
