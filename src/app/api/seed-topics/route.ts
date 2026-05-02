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

  // Batch 2 (priorities 78-122) — mirrored from Supabase blog_topics on 2026-05-02
  { topic: 'dairy goat milk production and processing', category: 'Livestock', primary_keyword: 'goat milk production', secondary_keywords: ['goat milking techniques', 'goat milk yoghurt', 'goat cheese making', 'goat milk business', 'milk handling hygiene'], priority: 78 },
  { topic: 'sheep diseases prevention and treatment', category: 'Livestock', primary_keyword: 'sheep diseases treatment', secondary_keywords: ['foot rot sheep', 'sheep vaccination schedule', 'blue tongue disease', 'sheep internal parasites', 'sheep deworming'], priority: 79 },
  { topic: 'profitable goat breeds for meat production', category: 'Livestock', primary_keyword: 'meat goat breeds', secondary_keywords: ['boer goat farming', 'galla goat', 'small east african goat', 'goat fattening', 'chevon market'], priority: 80 },
  { topic: 'goat and sheep breeding management', category: 'Livestock', primary_keyword: 'goat breeding management', secondary_keywords: ['buck selection', 'ram selection', 'breeding season goats', 'kidding management', 'lambing tips'], priority: 81 },
  { topic: 'small ruminant vaccination and deworming schedule', category: 'Livestock', primary_keyword: 'goat vaccination schedule', secondary_keywords: ['sheep vaccination calendar', 'deworming goats', 'PPR vaccine goats', 'clostridial vaccine sheep', 'anthelmintic goats'], priority: 82 },
  { topic: 'how to start a feed mill business', category: 'Feed Manufacturing', primary_keyword: 'feed mill business plan', secondary_keywords: ['animal feed manufacturing', 'feed mill equipment', 'feed business startup', 'feed mill license requirements'], priority: 83 },
  { topic: 'poultry feed formulation ratios and recipes', category: 'Feed Manufacturing', primary_keyword: 'poultry feed formulation', secondary_keywords: ['broiler feed formula', 'layer feed formula', 'chick mash recipe', 'grower feed ratios', 'feed conversion ratio'], priority: 84 },
  { topic: 'dairy cow feed formulation for milk production', category: 'Feed Manufacturing', primary_keyword: 'dairy feed formulation', secondary_keywords: ['TMR formulation', 'dairy concentrate mix', 'dairy meal recipe', 'lactation feed formula', 'dry cow feed mix'], priority: 85 },
  { topic: 'feed raw material sourcing for manufacturers', category: 'Feed Manufacturing', primary_keyword: 'feed raw materials sourcing', secondary_keywords: ['maize germ supplier', 'soybean meal', 'fish meal source', 'sunflower cake', 'cotton seed cake'], priority: 86 },
  { topic: 'feed quality control and testing standards', category: 'Feed Manufacturing', primary_keyword: 'feed quality control', secondary_keywords: ['feed testing laboratory', 'feed standards compliance', 'aflatoxin testing feed', 'proximate analysis feed', 'feed safety'], priority: 87 },
  { topic: 'pellet feed vs mash feed production', category: 'Feed Manufacturing', primary_keyword: 'pellet feed production', secondary_keywords: ['pellet mill machine', 'feed pelleting process', 'mash feed advantages', 'crumble feed production', 'pellet binder'], priority: 88 },
  { topic: 'feed premix formulation and vitamin supplementation', category: 'Feed Manufacturing', primary_keyword: 'feed premix formulation', secondary_keywords: ['vitamin premix poultry', 'mineral premix cattle', 'trace mineral supplement', 'feed additive mixing', 'premix supplier'], priority: 89 },
  { topic: 'feed storage and preservation techniques', category: 'Feed Manufacturing', primary_keyword: 'feed storage methods', secondary_keywords: ['grain storage best practices', 'feed moisture control', 'mycotoxin prevention feed', 'fumigation animal feed', 'feed shelf life'], priority: 90 },
  { topic: 'animal feed regulations and licensing requirements', category: 'Feed Manufacturing', primary_keyword: 'animal feed regulations', secondary_keywords: ['feed manufacturing permit', 'animal feed standards', 'feed labeling requirements', 'feed registration process', 'feed compliance'], priority: 91 },
  { topic: 'feed formulation software and least cost ration balancing', category: 'Feed Manufacturing', primary_keyword: 'feed formulation software', secondary_keywords: ['least cost feed formulation', 'ration balancing tool', 'feed calculator', 'feed optimization', 'nutrient requirement tables'], priority: 92 },
  { topic: 'Why Customers Complain About Powdery Feed: Fines, Sifting Losses and How to Fix Them', category: 'Feed Manufacturing', primary_keyword: 'feed fines and sifting losses', secondary_keywords: ['feed mill quality control', 'reducing fines in animal feed', 'feed dust complaints'], priority: 93 },
  { topic: 'Particle Size and FCR: How Worn Hammer Mill Screens Quietly Raise Your Customer Complaints', category: 'Feed Manufacturing', primary_keyword: 'feed particle size and FCR', secondary_keywords: ['hammer mill screen wear', 'grinding particle size feed', 'feed conversion ratio mill'], priority: 94 },
  { topic: 'The 10-Sample Mixer Uniformity Test Every Feed Mill Should Run This Month', category: 'Feed Manufacturing', primary_keyword: 'feed mixer uniformity test', secondary_keywords: ['mixer CV test feed', 'feed mixer quality control', 'coefficient of variation feed mixer'], priority: 95 },
  { topic: 'Aflatoxin Season: A Receiving-Bay Playbook to Reject Bad Maize Before It Enters Your Bin', category: 'Feed Manufacturing', primary_keyword: 'aflatoxin maize feed mill', secondary_keywords: ['mycotoxin control feed', 'rejecting contaminated maize', 'feed mill receiving QC'], priority: 96 },
  { topic: 'Pellet Durability Index (PDI): Why Your Pellets Crumble and the Cheapest Fixes First', category: 'Feed Manufacturing', primary_keyword: 'pellet durability index PDI', secondary_keywords: ['improving pellet quality', 'pellet binder feed', 'crumbling pellet causes'], priority: 97 },
  { topic: 'Steam Conditioning: The Three Numbers (Temperature, Moisture, Time) That Decide Pellet Quality', category: 'Feed Manufacturing', primary_keyword: 'steam conditioning pellet mill', secondary_keywords: ['conditioner temperature feed', 'pellet mill moisture', 'retention time conditioner'], priority: 98 },
  { topic: 'Building a One-Page Spec Sheet for Maize, Soya, Sunflower Cake and Fishmeal', category: 'Feed Manufacturing', primary_keyword: 'feed ingredient specification sheet', secondary_keywords: ['raw material QC feed mill', 'soya bean meal specs', 'fishmeal quality parameters'], priority: 99 },
  { topic: 'Hot Bins and Caking: Stopping Self-Heating in Maize and Soya Storage Before You Lose a Silo', category: 'Feed Manufacturing', primary_keyword: 'feed ingredient self-heating storage', secondary_keywords: ['silo storage feed mill', 'preventing caking in feed bins', 'grain moisture management'], priority: 100 },
  { topic: 'Costing a Tonne of Feed Honestly: Hidden Variable Costs That Eat Your Margin', category: 'Feed Manufacturing', primary_keyword: 'cost per tonne feed manufacturing', secondary_keywords: ['feed mill profitability', 'feed production cost breakdown', 'reducing feed mill costs'], priority: 101 },
  { topic: 'Hammer Mill vs Roller Mill: Which Grinder Pays Back Faster in a Mid-Size Feed Mill', category: 'Feed Manufacturing', primary_keyword: 'hammer mill vs roller mill', secondary_keywords: ['feed grinding equipment', 'choosing feed mill grinder', 'roller mill ROI feed'], priority: 102 },
  { topic: 'African Swine Fever: Early Warning Signs and the Biosecurity Steps That Actually Work', category: 'Pigs', primary_keyword: 'african swine fever prevention', secondary_keywords: ['ASF symptoms pigs', 'pig farm biosecurity', 'swine disease outbreak'], priority: 103 },
  { topic: 'Why Your Piglets Are Dying in the First Week and How to Stop It', category: 'Pigs', primary_keyword: 'piglet mortality first week', secondary_keywords: ['newborn piglet care', 'piglet survival rate', 'farrowing problems'], priority: 104 },
  { topic: 'Heat Stress in Pigs: Cooling, Water and Ventilation Fixes That Save Daily Weight Gain', category: 'Pigs', primary_keyword: 'heat stress in pigs management', secondary_keywords: ['pig cooling systems', 'swine ventilation', 'pig water requirements hot weather'], priority: 105 },
  { topic: 'Designing a Low-Cost Piggery That Actually Drains, Ventilates and Cleans Easily', category: 'Pigs', primary_keyword: 'low cost piggery design', secondary_keywords: ['pig housing layout', 'swine pen construction', 'piggery floor drainage'], priority: 106 },
  { topic: 'Pelleting vs Mash Feed: Which Is More Profitable for Your Mill', category: 'Feed Manufacturing', primary_keyword: 'pelleted feed vs mash feed', secondary_keywords: ['pellet mill', 'mash feed production', 'feed form comparison'], priority: 107 },
  { topic: 'Setting Up Quality Control in a Small-Scale Feed Mill', category: 'Feed Manufacturing', primary_keyword: 'feed mill quality control setup', secondary_keywords: ['QC feed manufacturing', 'feed sampling', 'lab testing feed mill'], priority: 108 },
  { topic: 'How to Calculate Feed Formulation Cost Per Tonne in a Commercial Mill', category: 'Feed Manufacturing', primary_keyword: 'feed formulation cost per tonne', secondary_keywords: ['least cost formulation', 'feed pricing', 'mill profitability'], priority: 109 },
  { topic: 'Using Premixes Correctly in Commercial Feed Manufacturing', category: 'Feed Manufacturing', primary_keyword: 'premix usage commercial feed', secondary_keywords: ['vitamin mineral premix', 'micro-ingredient mixing', 'feed additives dosing'], priority: 110 },
  { topic: 'Mycotoxin Risks in Feed Milling and How to Mitigate Them', category: 'Feed Manufacturing', primary_keyword: 'mycotoxin control feed mill', secondary_keywords: ['aflatoxin feed', 'toxin binders', 'raw material screening'], priority: 111 },
  { topic: 'Preventive Maintenance Schedule for Feed Mill Equipment', category: 'Feed Manufacturing', primary_keyword: 'feed mill equipment maintenance', secondary_keywords: ['mill downtime', 'pellet die wear', 'mixer maintenance'], priority: 112 },
  { topic: 'How to Source and Test Raw Materials for a Feed Mill', category: 'Feed Manufacturing', primary_keyword: 'feed mill raw material sourcing', secondary_keywords: ['maize quality testing', 'soya bean meal', 'ingredient procurement'], priority: 113 },
  { topic: 'KEBS Standards and Licensing for Feed Manufacturers in Kenya', category: 'Feed Manufacturing', primary_keyword: 'KEBS feed manufacturing standards Kenya', secondary_keywords: ['feed mill licensing Kenya', 'animal feed regulation', 'compliance feed industry'], priority: 114 },
  { topic: 'Scaling a Feed Mill: From Cottage Production to Commercial Operation', category: 'Feed Manufacturing', primary_keyword: 'scaling feed milling business', secondary_keywords: ['commercial feed mill setup', 'feed mill capacity expansion', 'feed business growth'], priority: 115 },
  { topic: 'How to Choose the Right Hammer Mill for Your Feed Milling Business', category: 'Feed Manufacturing', primary_keyword: 'hammer mill selection feed milling', secondary_keywords: ['feed mill equipment', 'hammer mill capacity', 'grinding machinery'], priority: 116 },
  { topic: 'Mange, Lice and Internal Worms: A Practical Pig Deworming and Spraying Schedule', category: 'Pigs', primary_keyword: 'pig deworming schedule', secondary_keywords: ['mange treatment pigs', 'swine parasite control', 'pig lice spray'], priority: 117 },
  { topic: 'Choosing the Right Boar: Breed, Conformation and Fertility Checks Before You Buy', category: 'Pigs', primary_keyword: 'choosing breeding boar pigs', secondary_keywords: ['boar selection criteria', 'pig breeding stock', 'swine fertility test'], priority: 118 },
  { topic: 'Heat Detection and Service Timing: Getting Sows Pregnant on the First Mating', category: 'Pigs', primary_keyword: 'sow heat detection timing', secondary_keywords: ['pig artificial insemination', 'sow estrus signs', 'pig breeding success rate'], priority: 119 },
  { topic: 'Iron Injections, Tail Docking and Castration: Day-One Piglet Procedures Done Right', category: 'Pigs', primary_keyword: 'piglet day one procedures', secondary_keywords: ['iron injection piglets', 'piglet castration', 'tail docking pigs'], priority: 120 },
  { topic: 'Costing a Kilo of Pork: Where Smallholder Pig Farmers Quietly Lose Money', category: 'Pigs', primary_keyword: 'cost of producing pork per kilo', secondary_keywords: ['pig farming profitability', 'piggery cost analysis', 'pork production margin'], priority: 121 },
  { topic: 'Selling Live Pigs vs Carcass: Pricing, Buyers and Negotiating a Better Deal', category: 'Pigs', primary_keyword: 'selling pigs for profit', secondary_keywords: ['pig marketing channels', 'live weight pricing', 'pork buyer negotiation'], priority: 122 },
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
