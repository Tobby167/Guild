import type { GuildCategory, GuildWork } from "@/lib/guild-data";

export type GuildRole = "buyer" | "creator" | "both";
export type VerificationStatus = "pending" | "verified";

export type GuildDemoProfile = {
  id: string;
  slug: string;
  name: string;
  email: string;
  role: GuildRole;
  category?: GuildCategory;
  location?: string;
  bio?: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
  createdAt: string;
};

export type GuildDemoSession = {
  profileId: string;
  name: string;
  email: string;
  role: GuildRole;
  creatorSlug?: string;
  creatorName?: string;
};

export type GuildDemoWork = {
  id: string;
  creatorSlug: string;
  creatorName: string;
  title: string;
  category: GuildCategory;
  format: GuildWork["format"];
  priceRange: string;
  leadTime: string;
  commissionReady: boolean;
  summary: string;
  materials: string[];
  imageLabel: string;
  imageDataUrl?: string;
  createdAt: string;
};

export type GuildRequestStatus = "new" | "quoted" | "archived";

export type GuildDemoRequest = {
  id: string;
  creatorSlug: string;
  creatorName: string;
  workSlug?: string;
  workTitle?: string;
  buyerName: string;
  buyerEmail: string;
  projectTitle: string;
  category: string;
  budgetRange: string;
  neededBy: string;
  description: string;
  materials: string;
  deliveryNotes: string;
  referenceNotes: string;
  status: GuildRequestStatus;
  createdAt: string;
};

const STORAGE_KEYS = {
  profiles: "guild.demo.profiles",
  session: "guild.demo.session",
  uploads: "guild.demo.uploads",
  requests: "guild.demo.requests",
} as const;

const SESSION_EVENT = "guild-session-change";

function isBrowser() {
  return typeof window !== "undefined";
}

function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function makeGuildId(prefix: string) {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${prefix}-${random}`;
}

export function makeGuildSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getDemoProfiles() {
  return readStorage<GuildDemoProfile[]>(STORAGE_KEYS.profiles, []);
}

export function saveDemoProfile(profile: GuildDemoProfile) {
  const profiles = getDemoProfiles();
  const nextProfiles = [...profiles.filter((item) => item.id !== profile.id), profile];
  writeStorage(STORAGE_KEYS.profiles, nextProfiles);
  return profile;
}

export function getCurrentSession() {
  return readStorage<GuildDemoSession | null>(STORAGE_KEYS.session, null);
}

export function saveCurrentSession(session: GuildDemoSession) {
  writeStorage(STORAGE_KEYS.session, session);

  if (isBrowser()) {
    window.dispatchEvent(new Event(SESSION_EVENT));
  }

  return session;
}

export function clearCurrentSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEYS.session);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getDemoWorks() {
  return readStorage<GuildDemoWork[]>(STORAGE_KEYS.uploads, []);
}

export function saveDemoWork(work: GuildDemoWork) {
  const works = getDemoWorks();
  const nextWorks = [work, ...works.filter((item) => item.id !== work.id)];
  writeStorage(STORAGE_KEYS.uploads, nextWorks);
  return work;
}

export function getWorksForCreator(creatorSlug: string) {
  return getDemoWorks().filter((work) => work.creatorSlug === creatorSlug);
}

export function getDemoRequests() {
  return readStorage<GuildDemoRequest[]>(STORAGE_KEYS.requests, []);
}

export function saveDemoRequest(request: GuildDemoRequest) {
  const requests = getDemoRequests();
  const nextRequests = [request, ...requests.filter((item) => item.id !== request.id)];
  writeStorage(STORAGE_KEYS.requests, nextRequests);
  return request;
}

export function getRequestsForCreator(creatorSlug: string) {
  return getDemoRequests().filter((request) => request.creatorSlug === creatorSlug);
}

export function updateRequestStatus(requestId: string, status: GuildRequestStatus) {
  const requests = getDemoRequests();
  const nextRequests = requests.map((request) =>
    request.id === requestId ? { ...request, status } : request,
  );
  writeStorage(STORAGE_KEYS.requests, nextRequests);
}

export function updateProfileVerification(
  profileId: string,
  verificationStatus: VerificationStatus,
) {
  const profiles = getDemoProfiles();
  const nextProfiles = profiles.map((profile) =>
    profile.id === profileId
      ? {
          ...profile,
          verificationStatus,
          verified: verificationStatus === "verified",
        }
      : profile,
  );

  writeStorage(STORAGE_KEYS.profiles, nextProfiles);

  const currentSession = getCurrentSession();
  if (currentSession) {
    writeStorage(STORAGE_KEYS.session, currentSession);
  }
}
