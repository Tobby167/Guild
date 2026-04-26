import type { GuildDemoSession, GuildRequestStatus } from "@/lib/guild-demo-state";
import type { GuildCategory } from "@/lib/guild-data";
import { getSupabaseBrowserClient } from "./client";
import type { GuildWorkPost } from "./works";

export type GuildCommissionRequest = {
  id: string;
  creator_id: string;
  creator_slug: string;
  creator_name: string;
  buyer_id: string;
  buyer_name: string;
  buyer_email: string;
  work_post_id: string | null;
  work_title: string | null;
  project_title: string;
  category: string;
  budget_range: string;
  needed_by: string;
  description: string;
  materials: string | null;
  delivery_notes: string | null;
  reference_notes: string | null;
  status: GuildRequestStatus;
  created_at: string;
};

export type GuildCreatorOption = {
  creatorId: string;
  creatorSlug: string;
  creatorName: string;
  creatorVerified: boolean;
  category: GuildCategory;
};

export type GuildCommissionRequestInput = {
  session: GuildDemoSession;
  creatorId: string;
  creatorSlug: string;
  creatorName: string;
  projectTitle: string;
  category: string;
  budgetRange: string;
  neededBy: string;
  description: string;
  materials: string;
  deliveryNotes: string;
  referenceNotes: string;
  work?: GuildWorkPost;
};

export function buildCreatorOptionsFromPosts(posts: GuildWorkPost[]) {
  const seen = new Map<string, GuildCreatorOption>();

  for (const post of posts) {
    if (!seen.has(post.creator_id)) {
      seen.set(post.creator_id, {
        creatorId: post.creator_id,
        creatorSlug: post.creator_slug,
        creatorName: post.creator_name,
        creatorVerified: post.creator_verified,
        category: post.category,
      });
    }
  }

  return [...seen.values()];
}

export async function fetchRequestsForCreator(creatorId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("commission_requests")
    .select("*")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as GuildCommissionRequest[];
}

export async function createCommissionRequest(input: GuildCommissionRequestInput) {
  const supabase = getSupabaseBrowserClient();
  const payload = {
    creator_id: input.creatorId,
    creator_slug: input.creatorSlug,
    creator_name: input.creatorName,
    buyer_id: input.session.profileId,
    buyer_name: input.session.name,
    buyer_email: input.session.email,
    work_post_id: input.work?.id ?? null,
    work_title: input.work?.title ?? null,
    project_title: input.projectTitle.trim(),
    category: input.category.trim(),
    budget_range: input.budgetRange,
    needed_by: input.neededBy.trim(),
    description: input.description.trim(),
    materials: input.materials.trim() || null,
    delivery_notes: input.deliveryNotes.trim() || null,
    reference_notes: input.referenceNotes.trim() || null,
    status: "new" as const,
  };

  const { data, error } = await supabase
    .from("commission_requests")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as GuildCommissionRequest;
}

export async function updateCommissionRequestStatus(
  requestId: string,
  status: GuildRequestStatus,
) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("commission_requests")
    .update({ status })
    .eq("id", requestId);

  if (error) {
    throw error;
  }
}
