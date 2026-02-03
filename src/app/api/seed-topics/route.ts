import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// Force dynamic to prevent build-time evaluation
export const dynamic = 'force-dynamic';

const topics = [
  // Poultry Health (15 topics)
  { topic: 'How to Prevent Newcastle Disease in Chickens', category: 'poultry', primary_keyword: 'newcastle disease prevention kenya', secondary_keywords: ['poultry vaccination', 'chicken diseases', 'layer health'], priority: 1 },
  { topic: 'Complete Guide to Coccidiosis Treatment in Poultry', category: 'poultry', primary_keyword: 'coccidiosis treatment poultry', secondary_keywords: ['chicken parasites', 'broiler diseases', 'poultry medication'], priority: 2 },
  { topic: 'Best Vaccination Schedule for Layers in Kenya', category: 'poultry', primary_keyword: 'layer vaccination schedule kenya', secondary_keywords: ['poultry vaccines', 'chicken immunization', 'egg production'], priority: 3 },
  { topic: 'Signs of Gumboro Disease and How to Treat It', category: 'poultry', primary_keyword: 'gumboro disease symptoms treatment', secondary_keywords: ['infectious bursal disease', 'broiler health', 'poultry farming'], priority: 4 },
  { topic: 'How to Improve Egg Production in Layers', category: 'poultry', primary_keyword: 'increase egg production layers', secondary_keywords: ['layer feed', 'poultry nutrition', 'egg farming kenya'], priority: 5 },
  { topic: 'Managing Heat Stress in Poultry During Hot Seasons', category: 'poultry', primary_keyword: 'heat stress poultry management', secondary_keywords: ['chicken cooling', 'poultry ventilation', 'summer farming'], priority: 6 },
  { topic: 'Natural Remedies for Common Chicken Diseases', category: 'poultry', primary_keyword: 'natural poultry remedies kenya', secondary_keywords: ['herbal chicken treatment', 'organic poultry farming'], priority: 7 },
  { topic: 'How to Start a Profitable Broiler Farm in Kenya', category: 'poultry', primary_keyword: 'broiler farming kenya guide', secondary_keywords: ['chicken business', 'poultry startup', 'meat production'], priority: 8 },
  { topic: 'Preventing Respiratory Infections in Chickens', category: 'poultry', primary_keyword: 'chicken respiratory infection treatment', secondary_keywords: ['poultry breathing problems', 'CRD treatment'], priority: 9 },
  { topic: 'Best Feeds for Broilers at Different Growth Stages', category: 'poultry', primary_keyword: 'broiler feed guide kenya', secondary_keywords: ['chicken nutrition', 'starter feed', 'finisher feed'], priority: 10 },
  { topic: 'How to Identify and Treat Fowl Typhoid', category: 'poultry', primary_keyword: 'fowl typhoid treatment kenya', secondary_keywords: ['salmonella poultry', 'chicken bacterial infection'], priority: 11 },
  { topic: 'Biosecurity Measures Every Poultry Farmer Needs', category: 'poultry', primary_keyword: 'poultry biosecurity kenya', secondary_keywords: ['chicken farm hygiene', 'disease prevention'], priority: 12 },
  { topic: 'Managing Poultry Litter for Healthier Birds', category: 'poultry', primary_keyword: 'poultry litter management', secondary_keywords: ['chicken bedding', 'ammonia control', 'farm hygiene'], priority: 13 },
  { topic: 'Deworming Schedule for Free-Range Chickens', category: 'poultry', primary_keyword: 'chicken deworming schedule', secondary_keywords: ['poultry parasites', 'kienyeji chicken health'], priority: 14 },
  { topic: 'How to Raise Healthy Kienyeji Chickens', category: 'poultry', primary_keyword: 'kienyeji chicken farming kenya', secondary_keywords: ['indigenous chicken', 'free range poultry'], priority: 15 },
  // Dairy Farming (15 topics)
  { topic: 'How to Increase Milk Production in Dairy Cows', category: 'dairy', primary_keyword: 'increase milk production kenya', secondary_keywords: ['dairy nutrition', 'cow feeding', 'milk yield'], priority: 16 },
  { topic: 'Preventing and Treating Mastitis in Dairy Cows', category: 'dairy', primary_keyword: 'mastitis treatment dairy cows', secondary_keywords: ['udder infection', 'milk quality', 'dairy health'], priority: 17 },
  { topic: 'Best Feeding Practices for High-Yielding Dairy Cows', category: 'dairy', primary_keyword: 'dairy cow feeding guide kenya', secondary_keywords: ['cattle nutrition', 'fodder', 'concentrates'], priority: 18 },
  { topic: 'Managing Tick-Borne Diseases in Cattle', category: 'dairy', primary_keyword: 'tick borne diseases cattle kenya', secondary_keywords: ['east coast fever', 'anaplasmosis', 'cattle dipping'], priority: 19 },
  { topic: 'Complete Guide to Dairy Calf Rearing', category: 'dairy', primary_keyword: 'dairy calf rearing kenya', secondary_keywords: ['calf nutrition', 'colostrum feeding', 'heifer management'], priority: 20 },
  { topic: 'How to Detect and Treat Milk Fever in Cows', category: 'dairy', primary_keyword: 'milk fever treatment cows', secondary_keywords: ['hypocalcemia', 'dairy cow diseases', 'calving problems'], priority: 21 },
  { topic: 'Silage Making Guide for Kenyan Dairy Farmers', category: 'dairy', primary_keyword: 'silage making kenya', secondary_keywords: ['fodder preservation', 'maize silage', 'dairy feed'], priority: 22 },
  { topic: 'Improving Fertility in Dairy Cows', category: 'dairy', primary_keyword: 'dairy cow fertility kenya', secondary_keywords: ['cattle breeding', 'AI insemination', 'reproduction'], priority: 23 },
  { topic: 'Managing Bloat in Cattle: Causes and Treatment', category: 'dairy', primary_keyword: 'cattle bloat treatment', secondary_keywords: ['rumen problems', 'cow digestion', 'emergency care'], priority: 24 },
  { topic: 'Best Dairy Breeds for Kenyan Climate', category: 'dairy', primary_keyword: 'best dairy breeds kenya', secondary_keywords: ['friesian', 'ayrshire', 'jersey', 'crossbreeds'], priority: 25 },
  { topic: 'How to Set Up a Zero-Grazing Dairy Unit', category: 'dairy', primary_keyword: 'zero grazing dairy kenya', secondary_keywords: ['stall feeding', 'intensive dairy', 'small-scale farming'], priority: 26 },
  { topic: 'Preventing Foot Rot in Dairy Cattle', category: 'dairy', primary_keyword: 'foot rot cattle treatment', secondary_keywords: ['hoof care', 'lameness', 'cattle hygiene'], priority: 27 },
  { topic: 'Mineral Supplementation for Dairy Cows', category: 'dairy', primary_keyword: 'dairy cow minerals kenya', secondary_keywords: ['calcium', 'phosphorus', 'cattle supplements'], priority: 28 },
  { topic: 'Managing Dairy Cows During Dry Season', category: 'dairy', primary_keyword: 'dairy farming dry season kenya', secondary_keywords: ['water management', 'drought feeding', 'fodder storage'], priority: 29 },
  { topic: 'How to Keep Accurate Dairy Farm Records', category: 'dairy', primary_keyword: 'dairy farm record keeping', secondary_keywords: ['milk records', 'breeding records', 'farm management'], priority: 30 },
  // Livestock & General (12 topics)
  { topic: 'Goat Farming for Beginners in Kenya', category: 'livestock', primary_keyword: 'goat farming kenya guide', secondary_keywords: ['dairy goats', 'meat goats', 'small ruminants'], priority: 31 },
  { topic: 'Preventing Worm Infestation in Sheep and Goats', category: 'livestock', primary_keyword: 'deworming sheep goats kenya', secondary_keywords: ['internal parasites', 'anthelmintics', 'small stock'], priority: 32 },
  { topic: 'How to Raise Healthy Pigs in Kenya', category: 'livestock', primary_keyword: 'pig farming kenya', secondary_keywords: ['swine nutrition', 'pork production', 'piggery'], priority: 33 },
  { topic: 'Managing Rabbit Farming for Profit', category: 'livestock', primary_keyword: 'rabbit farming kenya', secondary_keywords: ['bunny rearing', 'rabbit nutrition', 'meat rabbits'], priority: 34 },
  { topic: 'Best Practices for Livestock Vaccination', category: 'livestock', primary_keyword: 'livestock vaccination schedule kenya', secondary_keywords: ['cattle vaccines', 'goat vaccines', 'animal immunization'], priority: 35 },
  { topic: 'How to Treat Common Skin Diseases in Livestock', category: 'livestock', primary_keyword: 'livestock skin diseases treatment', secondary_keywords: ['mange', 'ringworm', 'cattle skin problems'], priority: 36 },
  { topic: 'Water Requirements for Different Farm Animals', category: 'livestock', primary_keyword: 'livestock water requirements', secondary_keywords: ['animal hydration', 'farm water management'], priority: 37 },
  { topic: 'Managing Animal Feed Costs on Your Farm', category: 'livestock', primary_keyword: 'reduce animal feed costs kenya', secondary_keywords: ['feed formulation', 'alternative feeds', 'farm economics'], priority: 38 },
  { topic: 'Signs of Nutritional Deficiencies in Farm Animals', category: 'livestock', primary_keyword: 'animal nutritional deficiency signs', secondary_keywords: ['vitamin deficiency', 'mineral deficiency', 'livestock health'], priority: 39 },
  { topic: 'How to Build a Low-Cost Animal Shelter', category: 'livestock', primary_keyword: 'animal shelter construction kenya', secondary_keywords: ['livestock housing', 'poultry house', 'cattle shed'], priority: 40 },
  // Feed & Nutrition (5 topics)
  { topic: 'Understanding Animal Feed Labels in Kenya', category: 'nutrition', primary_keyword: 'animal feed labels explained', secondary_keywords: ['feed ingredients', 'nutritional content', 'feed quality'], priority: 41 },
  { topic: 'Benefits of Feed Additives for Livestock', category: 'nutrition', primary_keyword: 'feed additives benefits livestock', secondary_keywords: ['growth promoters', 'probiotics', 'enzymes'], priority: 42 },
  { topic: 'How to Make Homemade Chicken Feed', category: 'nutrition', primary_keyword: 'homemade chicken feed kenya', secondary_keywords: ['poultry feed formulation', 'DIY feed', 'cost saving'], priority: 43 },
  { topic: 'Importance of Probiotics in Animal Nutrition', category: 'nutrition', primary_keyword: 'probiotics animal health', secondary_keywords: ['gut health', 'digestion', 'natural supplements'], priority: 44 },
  { topic: 'Fodder Crops Every Kenyan Farmer Should Grow', category: 'nutrition', primary_keyword: 'fodder crops kenya', secondary_keywords: ['napier grass', 'lucerne', 'desmodium'], priority: 45 },
  // Business & Management (5 topics)
  { topic: 'How to Write a Poultry Farm Business Plan', category: 'business', primary_keyword: 'poultry business plan kenya', secondary_keywords: ['chicken farming startup', 'farm financing'], priority: 46 },
  { topic: 'Marketing Your Farm Products in Kenya', category: 'business', primary_keyword: 'farm products marketing kenya', secondary_keywords: ['selling eggs', 'milk marketing', 'agribusiness'], priority: 47 },
  { topic: 'Government Support Programs for Kenyan Farmers', category: 'business', primary_keyword: 'government farming programs kenya', secondary_keywords: ['agricultural subsidies', 'farmer loans', 'support'], priority: 48 },
  { topic: 'Climate-Smart Farming Practices for Kenya', category: 'business', primary_keyword: 'climate smart agriculture kenya', secondary_keywords: ['sustainable farming', 'drought resistant', 'adaptation'], priority: 49 },
  { topic: 'Common Mistakes New Farmers Make and How to Avoid Them', category: 'business', primary_keyword: 'farming mistakes to avoid kenya', secondary_keywords: ['beginner farmer tips', 'farm management'], priority: 50 },
];

export async function GET(request: NextRequest) {
  // Simple auth check
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('blog_topics')
      .insert(topics)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, inserted: data?.length || 0 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

