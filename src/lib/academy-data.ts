export interface Video {
  id: string;
  title: string;
  slug: string;
}

export interface CategorySection {
  name: string;
  anchor: string;
  videos: Video[];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildSection(name: string, anchor: string, items: { id: string; title: string }[]): CategorySection {
  return {
    name,
    anchor,
    videos: items.map((v) => ({ ...v, slug: slugify(v.title) })),
  };
}

const POULTRY_SECTIONS: CategorySection[] = [
  buildSection('Welcome', 'welcome-poultry', [
    { id: '6BXIdqtdfAA', title: 'Welcome to Agrikima' },
  ]),
  buildSection('Getting Started', 'getting-started', [
    { id: '-m51mnGrLEU', title: 'Introduction to Poultry Farming' },
    { id: 'MXrLWo4xd68', title: 'Inside Out' },
  ]),
  buildSection('Brooding & Early Chick Care', 'brooding', [
    { id: 'TaL6EPbtPkQ', title: 'Brooding' },
    { id: 'nQj7g_DFWIU', title: 'Growing and Transition' },
    { id: 'XEcSxfxqCww', title: 'Incubation' },
  ]),
  buildSection('Poultry Feeding', 'poultry-feeding', [
    { id: '2I3kSMEcXKY', title: 'Feed Types, Forms and Practical Feeding Tips' },
    { id: '4HHYibFMkYc', title: 'Broiler Feeding' },
    { id: 'Xio1Ys6od7U', title: 'Layer Feeding' },
    { id: 'pQzfwHm8VD0', title: 'Poultry Feeding' },
    { id: 'iYTJsl8Ggj0', title: 'Poultry Supplementing' },
  ]),
  buildSection('Poultry Housing & Farm Setup', 'poultry-housing', [
    { id: 'QkucCuQs4D0', title: 'Building the Perfect Poultry House' },
    { id: 'Vam23oykzd4', title: 'Inside the Poultry House' },
    { id: 'yqxmpNmKOBo', title: 'Poultry Housing' },
    { id: 'svwduDniE4o', title: 'Poultry Lighting' },
  ]),
  buildSection('Poultry Health & Disease', 'poultry-health', [
    { id: 'mYjMDoP5rQE', title: 'Anti Microbial Resistance' },
    { id: 'L0iE79JJGnM', title: 'Nutritional Deficiency' },
    { id: 'Cz94nOBYuDg', title: 'Behavioural Abnormalities' },
    { id: 'mViMyFUUikY', title: 'Poultry Vaccination' },
    { id: 'hWWo1bpb_uw', title: 'Poultry Diseases' },
  ]),
  buildSection('Poultry Welfare & Biosecurity', 'poultry-welfare', [
    { id: 'mVyLbzEBlgU', title: 'Poultry Welfare' },
    { id: '5Z2lv3cia0M', title: 'Poultry Biosecurity Guide' },
  ]),
  buildSection('Farm Management & Records', 'poultry-management', [
    { id: 'cSuL_AN9OmQ', title: 'Poultry Record Keeping' },
  ]),
];

const LARGER_ANIMAL_SECTIONS: CategorySection[] = [
  buildSection('Welcome', 'welcome-large-animals', [
    { id: '6BXIdqtdfAA', title: 'Welcome to Agrikima' },
  ]),
  buildSection('Getting Started', 'large-animal-getting-started', [
    { id: 'KHI1TcD_iUs', title: 'Introduction to Large Animals' },
  ]),
  buildSection('Housing & Farm Setup', 'large-animal-housing', [
    { id: 'UxhKRZK4KgI', title: 'Large Animal Housing' },
  ]),
  buildSection('Feeding & Supplementing', 'large-animal-feeding', [
    { id: 'uNpJjeUrbFg', title: 'Large Animal Feeding' },
    { id: 'ZZ2ZobpI_z0', title: 'Supplementing' },
  ]),
  buildSection('Production', 'large-animal-production', [
    { id: 'HSJi_eEBXb0', title: 'Milking and Meat Production' },
  ]),
  buildSection('Breeding & Reproduction', 'large-animal-breeding', [
    { id: '5_gmI60MgXY', title: 'Breeding and Reproduction' },
  ]),
  buildSection('Health Management', 'large-animal-health', [
    { id: 'oOQjk5dsfu0', title: 'Health Management' },
  ]),
  buildSection('Sustainability & Natural Practices', 'large-animal-sustainability', [
    { id: 'PpOrLwIHwRU', title: 'Sustainability and Natural Practices' },
  ]),
  buildSection('Business & Marketing', 'large-animal-business', [
    { id: 'EuiljNR8FOw', title: 'Marketing and Revenue Addition' },
  ]),
  buildSection('Record Keeping & AMR', 'large-animal-records', [
    { id: 'Rycjn0k_nAE', title: 'Record Keeping' },
    { id: 'MPPmIdJodGg', title: 'AMR' },
  ]),
];

const BIOGAR_SERIES_SECTIONS: CategorySection[] = [
  buildSection('Welcome', 'welcome-biogar', [
    { id: '6BXIdqtdfAA', title: 'Welcome to Agrikima' },
  ]),
  buildSection('Biogar Series', 'biogar-series', [
    { id: 'ABAuvaWQSz4', title: 'Milk and Meat Quality Improvement' },
    { id: 'l427GouHJdA', title: 'Gut Health and Rumen Modulation' },
    { id: '4YZnIwGINuo', title: 'Feed Protection' },
    { id: 'urn0eIMLO8E', title: 'Environmental Benefits' },
    { id: 'hgadDRh1hR4', title: 'Disease Control and Immunity Support' },
    { id: 'R0faGbvLNA8', title: 'Ascites Support' },
    { id: 'WNqu5RHB1nE', title: 'Antibiotic Challenge' },
    { id: '9GvPtScnu8Q', title: 'Growth, Performance and Feed Conversion' },
    { id: 'qGyb46VA7fw', title: 'Mastitis Support' },
  ]),
];

const PRODUCT_VIDEOS_SECTIONS: CategorySection[] = [
  buildSection('Product Videos', 'product-videos', [
    { id: 'idMg2DsgSlI', title: 'Advice' },
    { id: '8IBXFWw11g0', title: 'Mix-5' },
  ]),
];

export const ACADEMY_DATA: Record<string, CategorySection[]> = {
  'Poultry Farming': POULTRY_SECTIONS,
  'Large Animals': LARGER_ANIMAL_SECTIONS,
  'Biogar Series': BIOGAR_SERIES_SECTIONS,
  'Product Videos': PRODUCT_VIDEOS_SECTIONS,
};

export interface VideoLookup {
  video: Video;
  groupName: string;
  section: CategorySection;
}

export function findVideoBySlug(slug: string): VideoLookup | null {
  for (const [groupName, sections] of Object.entries(ACADEMY_DATA)) {
    for (const section of sections) {
      const video = section.videos.find((v) => v.slug === slug);
      if (video) return { video, groupName, section };
    }
  }
  return null;
}

export function getAllVideoSlugs(): string[] {
  const slugs: string[] = [];
  for (const sections of Object.values(ACADEMY_DATA)) {
    for (const section of sections) {
      for (const video of section.videos) slugs.push(video.slug);
    }
  }
  return slugs;
}

export function getFlatVideoList(): Video[] {
  const out: Video[] = [];
  for (const sections of Object.values(ACADEMY_DATA)) {
    for (const section of sections) {
      for (const video of section.videos) out.push(video);
    }
  }
  return out;
}
