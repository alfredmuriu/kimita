export interface AcademyVideo {
  id: string;
  title: string;
  anchor: string; // Academy page section anchor
}

// All Academy videos with their anchors and keywords for matching
const ALL_VIDEOS: (AcademyVideo & { keywords: string[] })[] = [
  // Poultry
  { id: '-m51mnGrLEU', title: 'Introduction to Poultry Farming',        anchor: 'getting-started',    keywords: ['poultry', 'start', 'beginner', 'introduction', 'chicken', 'broiler', 'layer'] },
  { id: 'MXrLWo4xd68', title: 'Inside Out',                             anchor: 'getting-started',    keywords: ['poultry', 'chicken', 'farm', 'setup'] },
  { id: 'TaL6EPbtPkQ', title: 'Brooding',                               anchor: 'brooding',           keywords: ['brooding', 'chick', 'day old', 'temperature', 'heat', 'young'] },
  { id: 'nQj7g_DFWIU', title: 'Growing and Transition',                 anchor: 'brooding',           keywords: ['brooding', 'chick', 'growing', 'transition', 'grower'] },
  { id: 'XEcSxfxqCww', title: 'Incubation',                            anchor: 'brooding',           keywords: ['incubation', 'egg', 'hatch', 'chick'] },
  { id: '2I3kSMEcXKY', title: 'Feed Types, Forms and Practical Feeding Tips', anchor: 'poultry-feeding', keywords: ['feed', 'feeding', 'nutrition', 'diet', 'poultry'] },
  { id: '4HHYibFMkYc', title: 'Broiler Feeding',                        anchor: 'poultry-feeding',    keywords: ['broiler', 'feed', 'feeding', 'weight', 'growth'] },
  { id: 'Xio1Ys6od7U', title: 'Layer Feeding',                          anchor: 'poultry-feeding',    keywords: ['layer', 'feed', 'feeding', 'egg', 'production'] },
  { id: 'pQzfwHm8VD0', title: 'Poultry Feeding',                        anchor: 'poultry-feeding',    keywords: ['poultry', 'feed', 'feeding', 'supplement'] },
  { id: 'iYTJsl8Ggj0', title: 'Poultry Supplementing',                  anchor: 'poultry-feeding',    keywords: ['supplement', 'vitamin', 'mineral', 'poultry', 'additive'] },
  { id: 'QkucCuQs4D0', title: 'Building the Perfect Poultry House',     anchor: 'poultry-housing',    keywords: ['house', 'housing', 'setup', 'build', 'poultry', 'farm'] },
  { id: 'Vam23oykzd4', title: 'Inside the Poultry House',               anchor: 'poultry-housing',    keywords: ['house', 'housing', 'poultry', 'ventilation', 'biosecurity'] },
  { id: 'yqxmpNmKOBo', title: 'Poultry Housing',                        anchor: 'poultry-housing',    keywords: ['house', 'housing', 'poultry', 'space', 'density'] },
  { id: 'svwduDniE4o', title: 'Poultry Lighting',                       anchor: 'poultry-housing',    keywords: ['lighting', 'light', 'poultry', 'layer', 'production'] },
  { id: 'mYjMDoP5rQE', title: 'Anti Microbial Resistance',              anchor: 'poultry-health',     keywords: ['antibiotic', 'resistance', 'AMR', 'antimicrobial', 'drug'] },
  { id: 'L0iE79JJGnM', title: 'Nutritional Deficiency',                 anchor: 'poultry-health',     keywords: ['deficiency', 'nutrition', 'vitamin', 'mineral', 'weak'] },
  { id: 'Cz94nOBYuDg', title: 'Behavioural Abnormalities',              anchor: 'poultry-health',     keywords: ['behaviour', 'abnormal', 'stress', 'pecking', 'cannibalism'] },
  { id: 'mViMyFUUikY', title: 'Poultry Vaccination',                    anchor: 'poultry-health',     keywords: ['vaccination', 'vaccine', 'newcastle', 'gumboro', 'IBD', 'IB', 'prevention'] },
  { id: 'hWWo1bpb_uw', title: 'Poultry Diseases',                       anchor: 'poultry-health',     keywords: ['disease', 'newcastle', 'coccidiosis', 'gumboro', 'respiratory', 'infection', 'sick', 'mortality', 'death'] },
  { id: 'mVyLbzEBlgU', title: 'Poultry Welfare',                        anchor: 'poultry-welfare',    keywords: ['welfare', 'poultry', 'stress', 'density', 'humane'] },
  { id: '5Z2lv3cia0M', title: 'Poultry Biosecurity Guide',              anchor: 'poultry-welfare',    keywords: ['biosecurity', 'hygiene', 'disinfect', 'quarantine', 'disease prevention'] },
  { id: 'cSuL_AN9OmQ', title: 'Poultry Record Keeping',                 anchor: 'poultry-management', keywords: ['record', 'management', 'profit', 'cost', 'production', 'data'] },
  // Large animals
  { id: 'UxhKRZK4KgI', title: 'Large Animal Housing',                   anchor: 'large-animal-housing',      keywords: ['cattle', 'cow', 'dairy', 'goat', 'pig', 'housing', 'shelter'] },
  { id: 'uNpJjeUrbFg', title: 'Large Animal Feeding',                   anchor: 'large-animal-feeding',      keywords: ['cattle', 'cow', 'dairy', 'goat', 'pig', 'feed', 'feeding', 'nutrition'] },
  { id: 'ZZ2ZobpI_z0', title: 'Supplementing',                          anchor: 'large-animal-feeding',      keywords: ['supplement', 'mineral', 'vitamin', 'cattle', 'dairy', 'goat'] },
  { id: 'HSJi_eEBXb0', title: 'Milking and Meat Production',            anchor: 'large-animal-production',   keywords: ['milk', 'milking', 'dairy', 'meat', 'production', 'cow', 'cattle'] },
  { id: '5_gmI60MgXY', title: 'Breeding and Reproduction',              anchor: 'large-animal-breeding',     keywords: ['breed', 'breeding', 'reproduction', 'pregnancy', 'cattle', 'pig', 'goat'] },
  { id: 'oOQjk5dsfu0', title: 'Health Management',                      anchor: 'large-animal-health',       keywords: ['health', 'disease', 'cattle', 'dairy', 'cow', 'pig', 'goat', 'mastitis', 'treatment'] },
  { id: 'PpOrLwIHwRU', title: 'Sustainability and Natural Practices',   anchor: 'large-animal-sustainability', keywords: ['natural', 'sustainable', 'organic', 'antibiotic free', 'herbal'] },
  { id: 'EuiljNR8FOw', title: 'Marketing and Revenue Addition',         anchor: 'large-animal-business',     keywords: ['marketing', 'revenue', 'profit', 'business', 'sell', 'income', 'market'] },
];

// Return up to 3 videos relevant to the post's keywords and title
export function getRelatedVideos(keywords: string[], title: string): AcademyVideo[] {
  const searchTerms = [
    ...keywords.map(k => k.toLowerCase()),
    ...title.toLowerCase().split(/\s+/),
  ];

  const scored = ALL_VIDEOS.map(video => {
    const score = video.keywords.reduce((acc, kw) => {
      return acc + (searchTerms.some(t => t.includes(kw) || kw.includes(t)) ? 1 : 0);
    }, 0);
    return { video, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(s => ({ id: s.video.id, title: s.video.title, anchor: s.video.anchor }));
}
