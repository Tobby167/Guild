import type { User } from "@supabase/supabase-js";
import { guildCategories, type GuildCategory } from "@/lib/guild-data";
import type {
  GuildDemoProfile,
  GuildDemoSession,
  GuildRole,
  VerificationStatus,
} from "@/lib/guild-demo-state";
import { makeGuildSlug, saveCurrentSession, saveDemoProfile } from "@/lib/guild-demo-state";
import { getSupabaseBrowserClient } from "./client";

type ProfileRow = {
  id: string;
  slug: string;
  name: string;
  email: string;
  role: GuildRole;
  category: GuildCategory | null;
  location: string | null;
  bio: string | null;
  verified: boolean;
  verification_status: VerificationStatus;
  created_at: string;
};

type ProfileInput = {
  name: string;
  email: string;
  role: GuildRole;
  category?: GuildCategory;
  location?: string;
  bio?: string;
};

function toLocalProfile(row: ProfileRow): GuildDemoProfile {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    email: row.email,
    role: row.role,
    category: row.category ?? undefined,
    location: row.location ?? undefined,
    bio: row.bio ?? undefined,
    verified: row.verified,
    verificationStatus: row.verification_status,
    createdAt: row.created_at,
  };
}

function toSession(profile: GuildDemoProfile): GuildDemoSession {
  return {
    profileId: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    creatorSlug:
      profile.role === "creator" || profile.role === "both" ? profile.slug : undefined,
    creatorName:
      profile.role === "creator" || profile.role === "both" ? profile.name : undefined,
  };
}

function readUserMetadata(user: User) {
  const metadata = user.user_metadata ?? {};
  const categoryValue =
    typeof metadata.category === "string" && guildCategories.includes(metadata.category as GuildCategory)
      ? (metadata.category as GuildCategory)
      : undefined;

  return {
    slug:
      typeof metadata.slug === "string" && metadata.slug.trim()
        ? metadata.slug.trim()
        : makeGuildSlug(
            typeof metadata.name === "string" && metadata.name.trim()
              ? metadata.name
              : user.email?.split("@")[0] ?? "guild-user",
          ),
    name:
      typeof metadata.name === "string" && metadata.name.trim()
        ? metadata.name.trim()
        : user.email?.split("@")[0] ?? "Guild User",
    role:
      metadata.role === "buyer" || metadata.role === "creator" || metadata.role === "both"
        ? metadata.role
        : "buyer",
    category: categoryValue,
    location:
      typeof metadata.location === "string" && metadata.location.trim()
        ? metadata.location.trim()
        : undefined,
    bio:
      typeof metadata.bio === "string" && metadata.bio.trim()
        ? metadata.bio.trim()
        : undefined,
  } as const;
}

async function fetchProfileById(id: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle<ProfileRow>();

  if (error) {
    throw error;
  }

  return data ? toLocalProfile(data) : null;
}

export async function upsertSupabaseProfile(userId: string, input: ProfileInput) {
  const supabase = getSupabaseBrowserClient();
  const payload = {
    id: userId,
    slug: makeGuildSlug(input.name),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    category: input.category?.trim() || null,
    location: input.location?.trim() || null,
    bio: input.bio?.trim() || null,
    verified: false,
    verification_status: input.role === "buyer" ? "verified" : "pending",
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single<ProfileRow>();

  if (error) {
    throw error;
  }

  const profile = toLocalProfile(data);
  saveDemoProfile(profile);
  saveCurrentSession(toSession(profile));
  return profile;
}

export async function ensureProfileFromSupabaseUser(user: User) {
  const existing = await fetchProfileById(user.id);

  if (existing) {
    saveDemoProfile(existing);
    saveCurrentSession(toSession(existing));
    return existing;
  }

  const metadata = readUserMetadata(user);
  return upsertSupabaseProfile(user.id, {
    name: metadata.name,
    email: user.email ?? "",
    role: metadata.role,
    category: metadata.category,
    location: metadata.location,
    bio: metadata.bio,
  });
}

export async function syncLocalSessionFromSupabase() {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  if (!session?.user) {
    return null;
  }

  return ensureProfileFromSupabaseUser(session.user);
}

export async function signOutSupabase() {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
