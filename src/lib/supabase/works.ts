import type { GuildCategory, GuildWork } from "@/lib/guild-data";
import type { GuildDemoSession } from "@/lib/guild-demo-state";
import { getSupabaseBrowserClient } from "./client";
import {
  deleteWorkImage,
  uploadLegacyWorkImageDataUrl,
  uploadWorkImage,
} from "./storage";

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
  image_path: string | null;
  image_url: string | null;
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
  imageFile?: File | null;
};

export type GuildWorkPostUpdateInput = Omit<GuildWorkPostInput, "session" | "verified"> & {
  workId: string;
  session: GuildDemoSession;
  existingImagePath?: string | null;
  existingImageUrl?: string | null;
};

export async function fetchWorkPosts() {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("work_posts")
    .select(
      "id, creator_id, creator_slug, creator_name, creator_verified, title, category, format, price_range, lead_time, commission_ready, summary, materials, image_label, image_path, image_url, created_at",
    )
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

export async function migrateLegacyWorkPostImage(work: GuildWorkPost) {
  if (!work.image_data_url || work.image_url || !work.creator_id) {
    return work;
  }

  const uploaded = await uploadLegacyWorkImageDataUrl(
    work.creator_id,
    work.image_data_url,
    work.image_label || work.title,
  );

  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("work_posts")
    .update({
      image_path: uploaded.path,
      image_url: uploaded.url,
      image_data_url: null,
    })
    .eq("id", work.id)
    .eq("creator_id", work.creator_id)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  return data as GuildWorkPost;
}

export async function fetchWorkPostForCreator(workId: string, creatorId: string) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("work_posts")
    .select("*")
    .eq("id", workId)
    .eq("creator_id", creatorId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data ?? null) as GuildWorkPost | null;
}

export async function createWorkPost(input: GuildWorkPostInput) {
  const supabase = getSupabaseBrowserClient();
  const uploaded = input.imageFile
    ? await uploadWorkImage(
        input.session.profileId,
        input.imageFile,
        input.imageLabel.trim(),
      )
    : null;
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
    image_path: uploaded?.path ?? null,
    image_url: uploaded?.url ?? null,
    image_data_url: null,
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

export async function updateWorkPost(input: GuildWorkPostUpdateInput) {
  const supabase = getSupabaseBrowserClient();
  const uploaded = input.imageFile
    ? await uploadWorkImage(
        input.session.profileId,
        input.imageFile,
        input.imageLabel.trim(),
      )
    : null;
  const payload = {
    title: input.title.trim(),
    category: input.category,
    format: input.format,
    price_range: input.priceRange.trim(),
    lead_time: input.leadTime.trim(),
    commission_ready: input.commissionReady,
    summary: input.summary.trim(),
    materials: input.materials,
    image_label: input.imageLabel.trim(),
    image_path: uploaded?.path ?? input.existingImagePath ?? null,
    image_url: uploaded?.url ?? input.existingImageUrl ?? null,
    image_data_url: null,
  };

  const { data, error } = await supabase
    .from("work_posts")
    .update(payload)
    .eq("id", input.workId)
    .eq("creator_id", input.session.profileId)
    .select("*")
    .single();

  if (error) {
    throw error;
  }

  if (uploaded?.path && input.existingImagePath && input.existingImagePath !== uploaded.path) {
    try {
      await deleteWorkImage(input.existingImagePath);
    } catch {}
  }

  return data as GuildWorkPost;
}

export async function deleteWorkPost(workId: string, imagePath?: string | null) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("work_posts").delete().eq("id", workId);

  if (error) {
    throw error;
  }

  if (imagePath) {
    try {
      await deleteWorkImage(imagePath);
    } catch {}
  }
}
