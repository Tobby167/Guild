export type GuildCategory =
  | "Crochet"
  | "Knitting"
  | "Sewing"
  | "Embroidery"
  | "Tie-Dye"
  | "Beadwork"
  | "Handmade Accessories";

export type GuildCreator = {
  slug: string;
  name: string;
  category: GuildCategory;
  location: string;
  bio: string;
  specialties: string[];
  verified: boolean;
  turnaround: string;
  responseTime: string;
  rating: string;
  completedJobs: number;
  availability: string;
  highlight: string;
};

export type GuildWork = {
  slug: string;
  creatorSlug: string;
  title: string;
  category: GuildCategory;
  format: "Finished Piece" | "Work in Progress" | "Custom Example";
  priceRange: string;
  leadTime: string;
  commissionReady: boolean;
  summary: string;
  materials: string[];
  tags: string[];
  imageLabel: string;
  palette: [string, string, string];
};

export const guildCategories: GuildCategory[] = [
  "Crochet",
  "Knitting",
  "Sewing",
  "Embroidery",
  "Tie-Dye",
  "Beadwork",
  "Handmade Accessories",
];

export const creators: GuildCreator[] = [];

export const works: GuildWork[] = [];

export function getCreatorBySlug(slug: string) {
  return creators.find((creator) => creator.slug === slug);
}

export function getWorkBySlug(slug: string) {
  return works.find((work) => work.slug === slug);
}

export function getWorksByCreator(creatorSlug: string) {
  return works.filter((work) => work.creatorSlug === creatorSlug);
}

export const featuredWorks = works.filter((work) => work.commissionReady);
