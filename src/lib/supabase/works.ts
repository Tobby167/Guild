import type { GuildCategory, GuildWork } from "@/lib/guild-data";
import type { GuildDemoSession } from "@/lib/guild-demo-state";
import { getSupabaseBrowserClient } from "./client";

export type GuildWorkPost = {
  id: string;
  creator_id: string;
  creator_slug: string;
  creator_name: string;
  creator_verified: boolean;
  title: string;
  category: GuildCategory;
  format: GuildWork["format"];
  price_range: string;
  lead_time: string;
  commission_ready: boolean;
  summary: string;
  materials: string[];
  image_label: string;
  image_data_url: string | null;
  created_at: string;
};

export type GuildWorkPostInput = {
  session: GuildDemoSession;
  verified: boolean;
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
};

export async function fetchWorkPosts() {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("work_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as GuildWorkPost[];
}

export async function fetchWorkPostsForCreator(creatorId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("work_posts")
    .select("*")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as GuildWorkPost[];
}

export async function createWorkPost(input: GuildWorkPostInput) {
  const supabase = getSupabaseBrowserClient();
  const payload = {
    creator_id: input.session.profileId,
    creator_slug: input.session.creatorSlug ?? input.session.profileId,
    creator_name: input.session.creatorName ?? input.session.name,
    creator_verified: input.verified,
    title: input.title.trim(),
    category: input.category,
    format: input.format,
    price_range: input.priceRange.trim(),
    lead_time: input.leadTime.trim(),
    commission_ready: input.commissionReady,
    summary: input.summary.trim(),
    materials: input.materials,
    image_label: input.imageLabel.trim(),
    image_data_url: input.imageDataUrl ?? null,
  };

  const { data, error } = await supabase
    .from("work_posts")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as GuildWorkPost;
}

export async function deleteWorkPost(workId: string) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("work_posts").delete().eq("id", workId);

  if (error) {
    throw error;
  }
}
