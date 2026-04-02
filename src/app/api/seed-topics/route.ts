import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

// Force dynamic to prevent build-time evaluation
export const dynamic = 'force-dynamic';

const topics = [
  // Poultry Health (15 topics)
  { topic: 'How to Prevent Newcastle Disease in Chickens', category: 'poultry', primary_keyword: 'newcastle disease prevention poultry', secondary_keywords: ['poultry vaccination', 'chicken diseases', 'layer health'], priority: 1 },
  { topic: 'Complete Guide to Coccidiosis Treatment in Poultry', category: 'poultry', primary_keyword: 'coccidiosis treatment poultry', secondary_keywords: ['chicken parasites', 'broiler diseases', 'poultry medication'], priority: 2 },
  { topic: 'Best Vaccination Schedule for Layers', category: 'poultry', primary_keyword: 'layer vaccination schedule', secondary_keywords: ['poultry vaccines', 'chicken immunization', 'egg production'], priority: 3 },
  { topic: 'Signs of Gumboro Disease and How to Treat It', category: 'poultry', primary_keyword: 'gumboro disease symptoms treatment', secondary_keywords: ['infectious bursal disease', 'broiler health', 'poultry farming'], priority: 4 },
  { topic: 'How to Improve Egg Production in Layers', category: 'poultry', primary_keyword: 'increase egg production layers', secondary_keywords: ['layer feed', 'poultry nutrition', 'egg farming'], priority: 5 },
  { topic: 'Managing Heat Stress in Poultry During Hot Seasons', category: 'poultry', primary_keyword: 'heat stress poultry management', secondary_keywords: ['chicken cooling', 'poultry ventilation', 'summer farming'], priority: 6 },
  { topic: 'Natural Remedies for Common Chicken Diseases', category: 'poultry', primary_keyword: 'natural poultry remedies', secondary_keywords: ['herbal chicken treatment', 'organic poultry farming'], priority: 7 },
  { topic: 'How to Start a Profitable Broiler Farm', category: 'poultry', primary_keyword: 'broiler farming guide', secondary_keywords: ['chicken business', 'poultry startup', 'meat production'], priority: 8 },
  { topic: 'Preventing Respiratory Infections in Chickens', category: 'poultry', primary_keyword: 'chicken respiratory infection treatment', secondary_keywords: ['poultry breathing problems', 'CRD treatment'], priority: 9 },
  { topic: 'Best Feeds for Broilers at Different Growth Stages', category: 'poultry', primary_keyword: 'broiler feed guide', secondary_keywords: ['chicken nutrition', 'starter feed', 'finisher feed'], priority: 10 },
  { topic: 'How to Identify and Treat Fowl Typhoid', category: 'poultry', primary_keyword: 'fowl typhoid treatment', secondary_keywords: ['salmonella poultry', 'chicken bacterial infection'], priority: 11 },
  { topic: 'Biosecurity Measures Every Poultry Farmer Needs', category: 'poultry', primary_keyword: 'poultry biosecurity', secondary_keywords: ['chicken farm hygiene', 'disease prevention'], priority: 12 },
  { topic: 'Managing Poultry Litter for Healthier Birds', category: 'poultry', primary_keyword: 'poultry litter management', secondary_keywords: ['chicken bedding', 'ammonia control', 'farm hygiene'], priority: 13 },
  { topic: 'Deworming Schedule for Free-Range Chickens', category: 'poultry', primary_keyword: 'chicken deworming schedule', secondary_keywords: ['poultry parasites', 'kienyeji chicken health'], priority: 14 },
  { topic: 'How to Raise Healthy Kienyeji Chickens', category: 'poultry', primary_keyword: 'kienyeji chicken farming', secondary_keywords: ['indigenous chicken', 'free range poultry'], priority: 15 },

  // Dairy Farming (15 topics)
  { topic: 'How to Increase Milk Production in Dairy Cows', category: 'dairy', primary_keyword: 'increase milk production dairy cows', secondary_keywords: ['dairy nutrition', 'cow feeding', 'milk yield'], priority: 16 },
  { topic: 'Preventing and Treating Mastitis in Dairy Cows', category: 'dairy', primary_keyword: 'mastitis treatment dairy cows', secondary_keywords: ['udder infection', 'milk quality', 'dairy health'], priority: 17 },
  { topic: 'Best Feeding Practices for High-Yielding Dairy Cows', category: 'dairy', primary_keyword: 'dairy cow feeding guide', secondary_keywords: ['cattle nutrition', 'fodder', 'concentrates'], priority: 18 },
  { topic: 'Managing Tick-Borne Diseases in Cattle', category: 'dairy', primary_keyword: 'tick borne diseases cattle', secondary_keywords: ['east coast fever', 'anaplasmosis', 'cattle dipping'], priority: 19 },
  { topic: 'Complete Guide to Dairy Calf Rearing', category: 'dairy', primary_keyword: 'dairy calf rearing guide', secondary_keywords: ['calf nutrition', 'colostrum feeding', 'heifer management'], priority: 20 },
  { topic: 'How to Detect and Treat Milk Fever in Cows', category: 'dairy', primary_keyword: 'milk fever treatment cows', secondary_keywords: ['hypocalcemia', 'dairy cow diseases', 'calving problems'], priority: 21 },
  { topic: 'Silage Making Guide for Dairy Farmers', category: 'dairy', primary_keyword: 'silage making dairy farmers', secondary_keywords: ['fodder preservation', 'maize silage', 'dairy feed'], priority: 22 },
  { topic: 'Improving Fertility in Dairy Cows', category: 'dairy', primary_keyword: 'dairy cow fertility', secondary_keywords: ['cattle breeding', 'AI insemination', 'reproduction'], priority: 23 },
  { topic: 'Managing Bloat in Cattle: Causes and Treatment', category: 'dairy', primary_keyword: 'cattle bloat treatment', secondary_keywords: ['rumen problems', 'cow digestion', 'emergency care'], priority: 24 },
  { topic: 'Best Dairy Breeds for Tropical Climates', category: 'dairy', primary_keyword: 'best dairy breeds tropical', secondary_keywords: ['friesian', 'ayrshire', 'jersey', 'crossbreeds'], priority: 25 },
  { topic: 'How to Set Up a Zero-Grazing Dairy Unit', category: 'dairy', primary_keyword: 'zero grazing dairy unit setup', secondary_keywords: ['stall feeding', 'intensive dairy', 'small-scale farming'], priority: 26 },
  { topic: 'Preventing Foot Rot in Dairy Cattle', category: 'dairy', primary_keyword: 'foot rot cattle treatment', secondary_keywords: ['hoof care', 'lameness', 'cattle hygiene'], priority: 27 },
  { topic: 'Mineral Supplementation for Dairy Cows', category: 'dairy', primary_keyword: 'dairy cow mineral supplementation', secondary_keywords: ['calcium', 'phosphorus', 'cattle supplements'], priority: 28 },
  { topic: 'Managing Dairy Cows During Dry Season', category: 'dairy', primary_keyword: 'dairy farming dry season management', secondary_keywords: ['water management', 'drought feeding', 'fodder storage'], priority: 29 },
  { topic: 'How to Keep Accurate Dairy Farm Records', category: 'dairy', primary_keyword: 'dairy farm record keeping', secondary_keywords: ['milk records', 'breeding records', 'farm management'], priority: 30 },

  // Livestock & General (10 topics)
  { topic: 'Goat Farming for Beginners', category: 'livestock', primary_keyword: 'goat farming guide beginners', secondary_keywords: ['dairy goats', 'meat goats', 'small ruminants'], priority: 31 },
  { topic: 'Preventing Worm Infestation in Sheep and Goats', category: 'livestock', primary_keyword: 'deworming sheep goats', secondary_keywords: ['internal parasites', 'anthelmintics', 'small stock'], priority: 32 },
  { topic: 'How to Raise Healthy Pigs', category: 'livestock', primary_keyword: 'pig farming guide', secondary_keywords: ['swine nutrition', 'pork production', 'piggery'], priority: 33 },
  { topic: 'Managing Rabbit Farming for Profit', category: 'livestock', primary_keyword: 'rabbit farming for profit', secondary_keywords: ['bunny rearing', 'rabbit nutrition', 'meat rabbits'], priority: 34 },
  { topic: 'Best Practices for Livestock Vaccination', category: 'livestock', primary_keyword: 'livestock vaccination schedule', secondary_keywords: ['cattle vaccines', 'goat vaccines', 'animal immunization'], priority: 35 },
  { topic: 'How to Treat Common Skin Diseases in Livestock', category: 'livestock', primary_keyword: 'livestock skin diseases treatment', secondary_keywords: ['mange', 'ringworm', 'cattle skin problems'], priority: 36 },
  { topic: 'Water Requirements for Different Farm Animals', category: 'livestock', primary_keyword: 'livestock water requirements', secondary_keywords: ['animal hydration', 'farm water management'], priority: 37 },
  { topic: 'Managing Animal Feed Costs on Your Farm', category: 'livestock', primary_keyword: 'reduce animal feed costs', secondary_keywords: ['feed formulation', 'alternative feeds', 'farm economics'], priority: 38 },
  { topic: 'Signs of Nutritional Deficiencies in Farm Animals', category: 'livestock', primary_keyword: 'animal nutritional deficiency signs', secondary_keywords: ['vitamin deficiency', 'mineral deficiency', 'livestock health'], priority: 39 },
  { topic: 'How to Build a Low-Cost Animal Shelter', category: 'livestock', primary_keyword: 'animal shelter construction low cost', secondary_keywords: ['livestock housing', 'poultry house', 'cattle shed'], priority: 40 },

  // Feed & Nutrition (5 topics)
  { topic: 'Understanding Animal Feed Labels', category: 'nutrition', primary_keyword: 'animal feed labels explained', secondary_keywords: ['feed ingredients', 'nutritional content', 'feed quality'], priority: 41 },
  { topic: 'Benefits of Feed Additives for Livestock', category: 'nutrition', primary_keyword: 'feed additives benefits livestock', secondary_keywords: ['growth promoters', 'probiotics', 'enzymes'], priority: 42 },
  { topic: 'How to Make Homemade Chicken Feed', category: 'nutrition', primary_keyword: 'homemade chicken feed recipe', secondary_keywords: ['poultry feed formulation', 'DIY feed', 'cost saving'], priority: 43 },
  { topic: 'Importance of Probiotics in Animal Nutrition', category: 'nutrition', primary_keyword: 'probiotics animal health benefits', secondary_keywords: ['gut health', 'digestion', 'natural supplements'], priority: 44 },
  { topic: 'Fodder Crops Every Farmer Should Grow', category: 'nutrition', primary_keyword: 'fodder crops farming', secondary_keywords: ['napier grass', 'lucerne', 'desmodium'], priority: 45 },

  // Animal Feed Preparation — Cows (6 topics)
  { topic: 'How to Prepare and Balance Dairy Cow Feed at Home', category: 'dairy', primary_keyword: 'homemade dairy cow feed preparation', secondary_keywords: ['cattle feed formulation', 'dairy nutrition', 'cow feed ingredients'], priority: 46 },
  { topic: 'How to Make TMR (Total Mixed Ration) for Dairy Cows', category: 'dairy', primary_keyword: 'total mixed ration dairy cows', secondary_keywords: ['cattle feed mixing', 'balanced cow diet', 'TMR feeding'], priority: 47 },
  { topic: 'Homemade Concentrate Mix for High-Yielding Dairy Cows', category: 'dairy', primary_keyword: 'dairy cow concentrate mix recipe', secondary_keywords: ['dairy supplement', 'milk production feed', 'cow nutrition'], priority: 48 },
  { topic: 'How to Make Silage at Home for Cattle Feeding', category: 'dairy', primary_keyword: 'making silage for cattle', secondary_keywords: ['maize silage', 'fodder fermentation', 'dry season feed'], priority: 49 },
  { topic: 'Using Urea Molasses Block for Cattle Nutrition', category: 'dairy', primary_keyword: 'urea molasses block cattle', secondary_keywords: ['protein supplement cattle', 'lick block', 'beef cattle feed'], priority: 50 },
  { topic: 'Best Local Ingredients for Making Cattle Feed', category: 'dairy', primary_keyword: 'local cattle feed ingredients', secondary_keywords: ['cheap cow feed', 'maize bran', 'sunflower cake cattle'], priority: 51 },

  // Animal Feed Preparation — Goats & Sheep (5 topics)
  { topic: 'How to Prepare Balanced Feed for Dairy Goats', category: 'livestock', primary_keyword: 'dairy goat feed preparation', secondary_keywords: ['goat concentrate mix', 'milk goat nutrition', 'goat feeding guide'], priority: 52 },
  { topic: 'Making Homemade Feed for Sheep and Goats', category: 'livestock', primary_keyword: 'homemade sheep goat feed', secondary_keywords: ['small ruminant nutrition', 'goat feed ingredients', 'sheep feeding'], priority: 53 },
  { topic: 'Feed Preparation for Pregnant and Lactating Goats', category: 'livestock', primary_keyword: 'pregnant goat feed requirements', secondary_keywords: ['lactating goat nutrition', 'doe feeding', 'goat mineral supplement'], priority: 54 },
  { topic: 'How to Make a Mineral Lick for Goats and Sheep', category: 'livestock', primary_keyword: 'mineral lick for goats sheep', secondary_keywords: ['small ruminant minerals', 'goat salt lick', 'sheep supplements'], priority: 55 },
  { topic: 'Using Crop Residues to Prepare Goat and Sheep Feed', category: 'livestock', primary_keyword: 'crop residue feed goats sheep', secondary_keywords: ['maize stovers goats', 'straw feeding sheep', 'low cost ruminant feed'], priority: 56 },

  // Animal Feed Preparation — Pigs (5 topics)
  { topic: 'How to Prepare Homemade Pig Feed', category: 'livestock', primary_keyword: 'homemade pig feed preparation', secondary_keywords: ['pig feed formulation', 'swine nutrition', 'cheap pig feed'], priority: 57 },
  { topic: 'Pig Feed Formulation Guide for Growers and Finishers', category: 'livestock', primary_keyword: 'pig grower finisher feed formulation', secondary_keywords: ['swine feed mixing', 'pig growth feed', 'pork production feed'], priority: 58 },
  { topic: 'How to Ferment Pig Feed for Better Growth and Health', category: 'livestock', primary_keyword: 'fermented pig feed benefits', secondary_keywords: ['fermented swine feed', 'pig probiotics', 'gut health pigs'], priority: 59 },
  { topic: 'Preparing Sow Feed for Pregnant and Lactating Pigs', category: 'livestock', primary_keyword: 'sow feed preparation pregnancy lactation', secondary_keywords: ['breeding sow nutrition', 'piglet production feed', 'pig reproduction'], priority: 60 },
  { topic: 'Using Kitchen and Farm Waste to Supplement Pig Feed', category: 'livestock', primary_keyword: 'kitchen waste pig feed supplement', secondary_keywords: ['low cost pig feeding', 'farm waste swine', 'piggery cost reduction'], priority: 61 },

  // Animal Feed Preparation — Poultry (6 topics)
  { topic: 'How to Formulate Broiler Starter Feed at Home', category: 'poultry', primary_keyword: 'broiler starter feed formulation', secondary_keywords: ['chick feed recipe', 'homemade broiler feed', 'poultry feed making'], priority: 62 },
  { topic: 'Layer Feed Preparation Guide for Small-Scale Farmers', category: 'poultry', primary_keyword: 'layer feed preparation guide', secondary_keywords: ['homemade layer feed', 'egg production nutrition', 'layer pellet recipe'], priority: 63 },
  { topic: 'Making Your Own Kienyeji Chicken Feed', category: 'poultry', primary_keyword: 'kienyeji chicken feed preparation', secondary_keywords: ['indigenous chicken feed', 'free range poultry nutrition', 'local feed ingredients'], priority: 64 },
  { topic: 'Using Omena (Dagaa) as Protein in Homemade Poultry Feed', category: 'poultry', primary_keyword: 'omena dagaa poultry feed protein', secondary_keywords: ['fish meal chicken feed', 'cheap protein poultry', 'local feed ingredients'], priority: 65 },
  { topic: 'How to Make Chick Mash at Home for Day-Old Chicks', category: 'poultry', primary_keyword: 'homemade chick mash recipe', secondary_keywords: ['day old chick feed', 'starter chick nutrition', 'DIY chick mash'], priority: 66 },
  { topic: 'Feed Additives to Include When Mixing Poultry Feed at Home', category: 'poultry', primary_keyword: 'feed additives homemade poultry feed', secondary_keywords: ['vitamins poultry feed', 'amino acids chicken feed', 'homemade feed supplements'], priority: 67 },

  // Animal Feed Preparation — Dogs & Cats (5 topics)
  { topic: 'How to Prepare Balanced Home-Cooked Dog Food', category: 'pets', primary_keyword: 'homemade dog food preparation', secondary_keywords: ['balanced dog diet', 'dog food recipe', 'pet nutrition'], priority: 68 },
  { topic: 'Making Nutritious Dog Food Using Local Ingredients', category: 'pets', primary_keyword: 'dog food local ingredients', secondary_keywords: ['cheap dog food', 'homemade dog nutrition', 'pet feeding'], priority: 69 },
  { topic: 'How to Prepare High-Protein Cat Food at Home', category: 'pets', primary_keyword: 'homemade cat food high protein', secondary_keywords: ['cat diet home cooking', 'cat nutrition', 'raw cat food'], priority: 70 },
  { topic: 'Puppy Feed Preparation Guide: What to Feed at Each Stage', category: 'pets', primary_keyword: 'puppy feed preparation stages', secondary_keywords: ['puppy nutrition guide', 'weaning puppy food', 'dog growth stages'], priority: 71 },
  { topic: 'Signs Your Pet is Not Getting Proper Nutrition and How to Fix It', category: 'pets', primary_keyword: 'pet nutritional deficiency signs', secondary_keywords: ['dog diet problems', 'cat nutrition deficiency', 'pet health'], priority: 72 },

  // Business & Management (5 topics)
  { topic: 'How to Write a Poultry Farm Business Plan', category: 'business', primary_keyword: 'poultry business plan', secondary_keywords: ['chicken farming startup', 'farm financing'], priority: 73 },
  { topic: 'Marketing Your Farm Products', category: 'business', primary_keyword: 'farm products marketing', secondary_keywords: ['selling eggs', 'milk marketing', 'agribusiness'], priority: 74 },
  { topic: 'Government Support Programs for Farmers', category: 'business', primary_keyword: 'government farming programs', secondary_keywords: ['agricultural subsidies', 'farmer loans', 'support'], priority: 75 },
  { topic: 'Climate-Smart Farming Practices', category: 'business', primary_keyword: 'climate smart agriculture', secondary_keywords: ['sustainable farming', 'drought resistant', 'adaptation'], priority: 76 },
  { topic: 'Common Mistakes New Farmers Make and How to Avoid Them', category: 'business', primary_keyword: 'farming mistakes to avoid', secondary_keywords: ['beginner farmer tips', 'farm management'], priority: 77 },
];

export async function GET(request: NextRequest) {
  // Auth check - supports both header and query param
  const authHeader = request.headers.get('authorization');
  const { searchParams } = new URL(request.url);
  const secretParam = searchParams.get('secret');

  const isAuthorized =
    authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    secretParam === process.env.CRON_SECRET;

  if (!isAuthorized) {
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
