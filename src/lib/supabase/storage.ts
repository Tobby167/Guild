import { getSupabaseBrowserClient } from "./client";

export const GUILD_WORK_IMAGE_BUCKET = "guild-work-images";

function buildSafeFileName(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "guild-work";
}

function getExtensionFromFile(file: File) {
  const match = file.name.toLowerCase().match(/\.([a-z0-9]+)$/);

  if (match?.[1]) {
    return match[1];
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function dataUrlToBlob(dataUrl: string) {
  const [header, base64] = dataUrl.split(",");

  if (!header || !base64) {
    throw new Error("Invalid image data.");
  }

  const mimeMatch = header.match(/data:(.*?);base64/);
  const mimeType = mimeMatch?.[1] ?? "image/jpeg";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}

async function uploadBlob(path: string, blob: Blob) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.storage
    .from(GUILD_WORK_IMAGE_BUCKET)
    .upload(path, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: true,
      cacheControl: "3600",
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(GUILD_WORK_IMAGE_BUCKET).getPublicUrl(path);

  return {
    path,
    url: data.publicUrl,
  };
}

export async function uploadWorkImage(
  creatorId: string,
  file: File,
  label: string,
) {
  const extension = getExtensionFromFile(file);
  const safeName = buildSafeFileName(label);
  const uniquePart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const path = `${creatorId}/${safeName}-${uniquePart}.${extension}`;

  return uploadBlob(path, file);
}

export async function uploadLegacyWorkImageDataUrl(
  creatorId: string,
  dataUrl: string,
  label: string,
) {
  const blob = dataUrlToBlob(dataUrl);
  const extension =
    blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
  const safeName = buildSafeFileName(label);
  const uniquePart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const path = `${creatorId}/${safeName}-${uniquePart}.${extension}`;

  return uploadBlob(path, blob);
}

export async function deleteWorkImage(path?: string | null) {
  if (!path) {
    return;
  }

  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.storage
    .from(GUILD_WORK_IMAGE_BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
}
