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

export const creators: GuildCreator[] = [
  {
    slug: "blissart",
    name: "Blissart",
    category: "Crochet",
    location: "Lagos, Nigeria",
    bio: "A crochet-focused studio building polished statement bags and elegant handmade pieces with premium finishing.",
    specialties: ["Structured crochet bags", "Event-ready crochet pieces", "Custom color requests"],
    verified: true,
    turnaround: "7-10 days",
    responseTime: "Replies within 6 hours",
    rating: "4.9",
    completedJobs: 38,
    availability: "Open for custom requests",
    highlight: "Best for premium crochet pieces that need clean finishing and gift-worthy presentation.",
  },
  {
    slug: "ada-loom-house",
    name: "Ada Loom House",
    category: "Embroidery",
    location: "Abuja, Nigeria",
    bio: "Embroidery studio focused on sleeve details, bridal embellishment, and custom storytelling through stitched surface design.",
    specialties: ["Bridal embellishment", "Sleeve embroidery", "Custom initials and motifs"],
    verified: true,
    turnaround: "5-9 days",
    responseTime: "Replies within 12 hours",
    rating: "4.8",
    completedJobs: 27,
    availability: "Accepting limited commissions",
    highlight: "Best for custom embroidery that needs detail, symbolism, and a softer luxury feel.",
  },
  {
    slug: "mira-bead-house",
    name: "Mira Bead House",
    category: "Handmade Accessories",
    location: "Ibadan, Nigeria",
    bio: "Handmade accessory brand creating waist beads, jewelry, and beaded details with a clean modern aesthetic.",
    specialties: ["Waist beads", "Beaded jewelry", "Custom accessory sets"],
    verified: false,
    turnaround: "4-7 days",
    responseTime: "Replies within 8 hours",
    rating: "4.7",
    completedJobs: 19,
    availability: "Verification in progress",
    highlight: "Best for buyers who want handmade accessories with a personal, custom-fitted feel.",
  },
  {
    slug: "kemi-studio-tailor",
    name: "Kemi Studio Tailor",
    category: "Sewing",
    location: "Port Harcourt, Nigeria",
    bio: "A small sewing studio focused on made-to-fit fashion pieces, refined alterations, and made-from-reference custom work.",
    specialties: ["Made-to-fit outfits", "Occasion wear", "Reference-based custom sewing"],
    verified: true,
    turnaround: "10-14 days",
    responseTime: "Replies within 1 day",
    rating: "4.9",
    completedJobs: 44,
    availability: "Open for bookings this month",
    highlight: "Best for buyers who already know the look they want and need a reliable custom sewing process.",
  },
  {
    slug: "lola-knit-club",
    name: "Lola Knit Club",
    category: "Knitting",
    location: "Jos, Nigeria",
    bio: "A knitwear studio creating soft cardigans, textured throws, and made-to-order knitted pieces with calm color stories.",
    specialties: ["Cardigans", "Chunky blankets", "Custom color palettes"],
    verified: true,
    turnaround: "6-11 days",
    responseTime: "Replies within 10 hours",
    rating: "4.8",
    completedJobs: 24,
    availability: "Open for custom knit requests",
    highlight: "Best for buyers who want cozy knitted pieces with a polished handmade finish.",
  },
  {
    slug: "ore-dye-studio",
    name: "Ore Dye Studio",
    category: "Tie-Dye",
    location: "Abeokuta, Nigeria",
    bio: "Tie-dye and adire-inspired studio building color-rich wraps, loungewear, and statement fabric pieces by hand.",
    specialties: ["Adire-inspired sets", "Dyed wraps", "Custom pattern repeats"],
    verified: true,
    turnaround: "5-8 days",
    responseTime: "Replies within 9 hours",
    rating: "4.8",
    completedJobs: 31,
    availability: "Open for made-to-order drops",
    highlight: "Best for buyers who want color-forward dyed pieces with artisan pattern work.",
  },
  {
    slug: "bisi-bead-atelier",
    name: "Bisi Bead Atelier",
    category: "Beadwork",
    location: "Benin City, Nigeria",
    bio: "A beadwork studio focused on event bags, neck pieces, and detailed custom embellishment built bead by bead.",
    specialties: ["Beaded bags", "Statement collars", "Ceremonial beadwork"],
    verified: true,
    turnaround: "7-12 days",
    responseTime: "Replies within 7 hours",
    rating: "4.9",
    completedJobs: 29,
    availability: "Accepting custom beadwork this week",
    highlight: "Best for buyers who want beadwork with stronger structure, occasion detail, and hand-finished texture.",
  },
];

export const works: GuildWork[] = [
  {
    slug: "midnight-loom-bag",
    creatorSlug: "blissart",
    title: "Midnight Loom Handbag",
    category: "Crochet",
    format: "Finished Piece",
    priceRange: "N45,000 - N60,000",
    leadTime: "8-12 days",
    commissionReady: true,
    summary: "A black-and-gold crochet handbag built with a structured silhouette for evening wear and premium gifting.",
    materials: ["Cotton yarn", "Soft lining", "Gold clasp", "Reinforced handles"],
    tags: ["Commission Ready", "Evening Wear", "Structured Finish"],
    imageLabel: "Black and gold crochet handbag",
    palette: ["#11131a", "#c8a15a", "#f5ead9"],
  },
  {
    slug: "soft-shell-market-tote",
    creatorSlug: "blissart",
    title: "Soft Shell Market Tote",
    category: "Crochet",
    format: "Custom Example",
    priceRange: "N28,000 - N36,000",
    leadTime: "6-9 days",
    commissionReady: true,
    summary: "A roomy crochet tote designed for color customization, everyday use, and light personalization.",
    materials: ["Textured yarn", "Canvas lining", "Braided straps"],
    tags: ["Daily Use", "Color Customization", "Commission Ready"],
    imageLabel: "Neutral crochet tote with textured stitch pattern",
    palette: ["#8f7b67", "#efe2d2", "#483b30"],
  },
  {
    slug: "pearl-waist-set",
    creatorSlug: "mira-bead-house",
    title: "Pearl Waist Set",
    category: "Handmade Accessories",
    format: "Finished Piece",
    priceRange: "N12,000 - N18,000",
    leadTime: "3-5 days",
    commissionReady: true,
    summary: "A handmade waist bead set with layered pearl tones, sizing guidance, and fit customization.",
    materials: ["Glass beads", "Pearl accents", "Adjustable cord"],
    tags: ["Handmade Jewelry", "Custom Fit", "Gift Ready"],
    imageLabel: "Pearl-toned waist beads laid in soft curves",
    palette: ["#f3e6dc", "#bb8f7c", "#5e4236"],
  },
  {
    slug: "gold-loop-bracelet-stack",
    creatorSlug: "mira-bead-house",
    title: "Gold Loop Bracelet Stack",
    category: "Handmade Accessories",
    format: "Custom Example",
    priceRange: "N15,000 - N24,000",
    leadTime: "4-6 days",
    commissionReady: true,
    summary: "A custom bracelet stack blending beadwork and wire detail for event styling and personal gifts.",
    materials: ["Seed beads", "Wire loops", "Metal clasp"],
    tags: ["Bracelet Set", "Custom Color", "Handmade Accessory"],
    imageLabel: "Layered handmade bracelets with gold bead accents",
    palette: ["#d1a05e", "#2f241f", "#f8efe7"],
  },
  {
    slug: "bridal-sleeve-bloom",
    creatorSlug: "ada-loom-house",
    title: "Bridal Sleeve Bloom",
    category: "Embroidery",
    format: "Finished Piece",
    priceRange: "N30,000 - N48,000",
    leadTime: "5-8 days",
    commissionReady: true,
    summary: "Hand embroidery placed on sheer bridal sleeves with floral detail and soft metallic highlights.",
    materials: ["Organza", "Embroidery floss", "Beads", "Sequins"],
    tags: ["Bridal", "Custom Detail", "High Touch Finish"],
    imageLabel: "Soft floral embroidery on bridal sleeves",
    palette: ["#f5efe9", "#b4937a", "#816652"],
  },
  {
    slug: "storyline-initial-panel",
    creatorSlug: "ada-loom-house",
    title: "Storyline Initial Panel",
    category: "Embroidery",
    format: "Work in Progress",
    priceRange: "N18,000 - N26,000",
    leadTime: "4-6 days",
    commissionReady: false,
    summary: "An in-progress embroidery panel showing how custom initials and narrative motifs are developed.",
    materials: ["Cotton fabric", "Embroidery thread", "Tracing paper"],
    tags: ["Work in Progress", "Custom Initials", "Process Story"],
    imageLabel: "Embroidery sketch with stitched initials and traced motifs",
    palette: ["#e6d8ca", "#795f4c", "#3e3128"],
  },
  {
    slug: "emerald-occasion-set",
    creatorSlug: "kemi-studio-tailor",
    title: "Emerald Occasion Set",
    category: "Sewing",
    format: "Finished Piece",
    priceRange: "N65,000 - N95,000",
    leadTime: "10-14 days",
    commissionReady: true,
    summary: "A made-to-fit two-piece set tailored from reference photos with cleaner finishing and event wear detail.",
    materials: ["Crepe fabric", "Lining", "Invisible zipper", "Structured interfacing"],
    tags: ["Made-to-Fit", "Occasion Wear", "Commission Ready"],
    imageLabel: "Emerald green tailored set styled for an event",
    palette: ["#204d45", "#d4bea0", "#f6f0e6"],
  },
  {
    slug: "soft-noir-maxi-draft",
    creatorSlug: "kemi-studio-tailor",
    title: "Soft Noir Maxi Draft",
    category: "Sewing",
    format: "Work in Progress",
    priceRange: "N52,000 - N78,000",
    leadTime: "9-13 days",
    commissionReady: true,
    summary: "A drafting-stage custom maxi dress showing fitting notes, neckline revisions, and fabric decision points.",
    materials: ["Pattern paper", "Trial fabric", "Pins", "Measurement notes"],
    tags: ["Work in Progress", "Draft Review", "Custom Sewing"],
    imageLabel: "Dress draft pinned on a tailoring board",
    palette: ["#191919", "#c8a15a", "#d9d1c6"],
  },
  {
    slug: "cloud-stitch-cardigan",
    creatorSlug: "lola-knit-club",
    title: "Cloud Stitch Cardigan",
    category: "Knitting",
    format: "Finished Piece",
    priceRange: "N38,000 - N52,000",
    leadTime: "6-10 days",
    commissionReady: true,
    summary: "A soft oversized knit cardigan with custom sleeve length and color options for everyday wear.",
    materials: ["Merino blend yarn", "Ribbed cuffs", "Coconut buttons"],
    tags: ["Knitted Wear", "Soft Layers", "Commission Ready"],
    imageLabel: "Cream knit cardigan with textured cloud stitch",
    palette: ["#f3ece1", "#a78c74", "#4b3f36"],
  },
  {
    slug: "cocoa-cable-throw",
    creatorSlug: "lola-knit-club",
    title: "Cocoa Cable Throw",
    category: "Knitting",
    format: "Custom Example",
    priceRange: "N42,000 - N58,000",
    leadTime: "7-11 days",
    commissionReady: true,
    summary: "A cozy knitted throw designed for custom room palettes, gifting, and premium home styling.",
    materials: ["Chunky yarn", "Cable pattern chart", "Soft backing"],
    tags: ["Home Piece", "Gift Ready", "Custom Color"],
    imageLabel: "Chunky cocoa knit throw folded on a soft seat",
    palette: ["#5c4638", "#d8c7b4", "#efe6dd"],
  },
  {
    slug: "indigo-wave-kaftan",
    creatorSlug: "ore-dye-studio",
    title: "Indigo Wave Kaftan",
    category: "Tie-Dye",
    format: "Finished Piece",
    priceRange: "N34,000 - N49,000",
    leadTime: "5-8 days",
    commissionReady: true,
    summary: "A flowing tie-dye kaftan with hand-dyed indigo pattern movement and size customization for comfort wear.",
    materials: ["Cotton fabric", "Indigo dye", "Hand-cut trim"],
    tags: ["Adire Inspired", "Commission Ready", "Loungewear"],
    imageLabel: "Indigo tie-dye kaftan with wave pattern",
    palette: ["#193553", "#6b90b6", "#e8edf3"],
  },
  {
    slug: "sunset-swirl-headwrap",
    creatorSlug: "ore-dye-studio",
    title: "Sunset Swirl Headwrap",
    category: "Tie-Dye",
    format: "Custom Example",
    priceRange: "N9,000 - N14,000",
    leadTime: "3-4 days",
    commissionReady: true,
    summary: "A custom dyed headwrap set exploring warm spiral dye patterns for styling, gifting, and matching looks.",
    materials: ["Light cotton", "Reactive dye", "Finished edge hem"],
    tags: ["Headwrap", "Custom Pattern", "Color Story"],
    imageLabel: "Warm tie-dye headwrap in orange and rust spirals",
    palette: ["#b44934", "#eb8a4a", "#f6dcc2"],
  },
  {
    slug: "sunburst-bead-bag",
    creatorSlug: "bisi-bead-atelier",
    title: "Sunburst Bead Bag",
    category: "Beadwork",
    format: "Finished Piece",
    priceRange: "N55,000 - N78,000",
    leadTime: "8-12 days",
    commissionReady: true,
    summary: "A structured beaded bag built with layered warm tones and dense hand placement for event dressing.",
    materials: ["Glass seed beads", "Structured bag frame", "Satin lining"],
    tags: ["Beaded Bag", "Occasion Piece", "Commission Ready"],
    imageLabel: "Structured bead bag with sunburst patterning",
    palette: ["#8d4d2e", "#d7a35e", "#f5ead6"],
  },
  {
    slug: "royal-collar-study",
    creatorSlug: "bisi-bead-atelier",
    title: "Royal Collar Study",
    category: "Beadwork",
    format: "Work in Progress",
    priceRange: "N32,000 - N46,000",
    leadTime: "6-9 days",
    commissionReady: false,
    summary: "An in-progress statement bead collar showing pattern mapping, bead density, and placement trials.",
    materials: ["Pattern board", "Seed beads", "Thread base", "Fastening clasps"],
    tags: ["Process Story", "Statement Piece", "Work in Progress"],
    imageLabel: "Bead collar layout board with blue and gold sections",
    palette: ["#17385d", "#c9a44c", "#ebe3d3"],
  },
];

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
