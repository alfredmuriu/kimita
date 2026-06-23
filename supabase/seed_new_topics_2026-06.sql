-- 70 new blog topics (priorities 325-394), 2026-06-22.
-- 10 topics under each of the 7 existing site categories ONLY — no new themes.
-- DB category strings map to the /articles filter buttons like this:
--   Poultry -> "POULTRY", Dairy -> "DAIRY", Pigs -> "PIGS",
--   Livestock -> "GOATS AND SHEEP", Pets -> "PETS",
--   Feed Manufacturing -> "FEED MILLING", AMR -> "AMR".
-- Keywords are chosen to NOT overlap the 242 already-published articles.
-- `used` defaults to false; the generator publishes the lowest source_priority first.

INSERT INTO blog_topics (topic, category, primary_keyword, secondary_keywords, priority) VALUES
-- POULTRY (325-334)
('Duck Farming for Meat and Eggs', 'Poultry', 'duck farming guide', ARRAY['raising ducks kenya','duck housing','duck egg production'], 325),
('Commercial Turkey Production for the Festive Market', 'Poultry', 'turkey farming festive market', ARRAY['turkey rearing','christmas turkey','turkey fattening'], 326),
('Quail Egg Production and Marketing', 'Poultry', 'quail egg production', ARRAY['quail egg business','coturnix quail','quail egg health benefits'], 327),
('Setting Up a Small Egg Incubator at Home', 'Poultry', 'egg incubator setup', ARRAY['incubation temperature humidity','homemade incubator','hatching eggs'], 328),
('Candling Eggs to Track Embryo Development', 'Poultry', 'candling eggs', ARRAY['egg candling guide','infertile egg detection','embryo development'], 329),
('Improving Hatchability and Reducing Dead-in-Shell', 'Poultry', 'improving hatchability', ARRAY['low hatch rate causes','dead in shell','hatch window'], 330),
('Choosing a Brooder Heat Source: Charcoal, Gas or Infrared', 'Poultry', 'brooder heat source comparison', ARRAY['infrared brooder','gas brooder','charcoal jiko brooding'], 331),
('Vaccinating Poultry Through Drinking Water Correctly', 'Poultry', 'drinking water vaccination poultry', ARRAY['water vaccine technique','vaccine stabilizer','mass poultry vaccination'], 332),
('Grading, Packaging and Branding Eggs for Better Prices', 'Poultry', 'egg grading packaging', ARRAY['egg sizing','egg carton branding','premium egg market'], 333),
('Raising Guinea Fowl for Pest Control and Meat', 'Poultry', 'guinea fowl farming', ARRAY['keets rearing','guinea fowl free range','guinea fowl eggs'], 334),

-- DAIRY (335-344)
('Treating Calf Scours with Oral Rehydration', 'Dairy', 'calf scours treatment', ARRAY['calf diarrhoea','oral rehydration calves','scours electrolytes'], 335),
('Disbudding and Dehorning Calves Safely', 'Dairy', 'calf dehorning disbudding', ARRAY['disbudding paste','calf horn removal','dehorning iron'], 336),
('DIY Artificial Insemination vs Hiring a Technician', 'Dairy', 'dairy artificial insemination cost', ARRAY['DIY AI cattle','AI technician kenya','semen straw handling'], 337),
('Using Sexed Semen to Get More Heifer Calves', 'Dairy', 'sexed semen dairy', ARRAY['sexed semen cost benefit','heifer calf selection','dairy genetics'], 338),
('Setting Up Hydroponic Barley Fodder', 'Dairy', 'hydroponic fodder setup', ARRAY['barley fodder system','sprouted fodder','hydroponic green feed'], 339),
('Growing Azolla as a Cheap Protein Supplement', 'Dairy', 'azolla protein supplement', ARRAY['azolla cultivation','azolla livestock feed','azolla pond'], 340),
('Establishing Calliandra and Leucaena Protein Banks', 'Dairy', 'fodder protein banks', ARRAY['calliandra fodder','leucaena trees','protein forage shrubs'], 341),
('Recognising and Managing Lumpy Skin Disease', 'Dairy', 'lumpy skin disease cattle', ARRAY['LSD cattle treatment','lumpy skin vaccine','skin nodules cattle'], 342),
('Making and Marketing Mala and Yoghurt', 'Dairy', 'mala yoghurt value addition', ARRAY['fermented milk business','yoghurt processing','dairy value addition'], 343),
('Building a Small Milk ATM Vending Business', 'Dairy', 'milk ATM business', ARRAY['milk vending machine','raw milk dispenser','milk bar business'], 344),

-- PIGS (345-354)
('Smallholder Pork Value Addition: Sausages and Bacon', 'Pigs', 'pork value addition', ARRAY['pork sausage making','bacon curing smallholder','processed pork'], 345),
('Choosing Healthy Weaners When Buying Pigs', 'Pigs', 'choosing weaner pigs', ARRAY['buying weaners','healthy piglet selection','weaner pig checklist'], 346),
('Feeding Sweet Potato Vines and Forage to Pigs', 'Pigs', 'sweet potato vines pig feed', ARRAY['forage for pigs','pig roughage','cheap pig feed greens'], 347),
('Recognising and Controlling Swine Dysentery', 'Pigs', 'swine dysentery control', ARRAY['bloody diarrhoea pigs','pig gut health','dysentery treatment swine'], 348),
('Keeping Practical Pig Production Records', 'Pigs', 'pig record keeping', ARRAY['piggery records','sow productivity tracking','pig performance targets'], 349),
('Managing Boar Taint in Entire Male Pigs', 'Pigs', 'boar taint management', ARRAY['entire male pigs','boar taint causes','immunocastration'], 350),
('Building a Biogas Digester from Pig Manure', 'Pigs', 'pig manure biogas', ARRAY['piggery biogas digester','pig waste energy','biogas from manure'], 351),
('Artificial Insemination in Pigs: Semen Collection and Handling', 'Pigs', 'pig artificial insemination', ARRAY['boar semen collection','pig AI technique','swine semen handling'], 352),
('Using Faecal Egg Counts to Time Pig Deworming', 'Pigs', 'pig faecal egg count', ARRAY['worm burden pigs','strategic pig deworming','pig parasite monitoring'], 353),
('Managing Glasser Disease and Strep in Weaned Pigs', 'Pigs', 'glasser disease pigs', ARRAY['streptococcus suis pigs','weaner pig meningitis','haemophilus parasuis'], 354),

-- GOATS AND SHEEP -> Livestock (355-364)
('Dorper Sheep Farming for Fast Meat Production', 'Livestock', 'dorper sheep farming', ARRAY['dorper breed','meat sheep kenya','dorper fattening'], 355),
('Hair Sheep vs Wool Sheep: Which Suits Your Farm', 'Livestock', 'hair sheep vs wool sheep', ARRAY['red maasai sheep','wool sheep kenya','sheep breed selection'], 356),
('Fattening Sheep for the Eid and Festive Market', 'Livestock', 'fattening sheep eid market', ARRAY['sheep fattening ration','ram finishing','festive sheep market'], 357),
('Vaccinating Against Enterotoxaemia (Pulpy Kidney)', 'Livestock', 'enterotoxaemia vaccine sheep goats', ARRAY['pulpy kidney disease','clostridial vaccine','overeating disease'], 358),
('Treating Caseous Lymphadenitis Abscesses in Goats', 'Livestock', 'caseous lymphadenitis goats', ARRAY['goat abscess treatment','CLA goats','lymph node abscess'], 359),
('Mixing an Effective Footbath for Foot Rot', 'Livestock', 'footbath foot rot sheep goats', ARRAY['zinc sulphate footbath','copper sulphate footbath','hoof rot control'], 360),
('Artificial Insemination in Goats: Is It Worth It', 'Livestock', 'goat artificial insemination', ARRAY['goat AI kenya','dairy goat genetics','synchronising does AI'], 361),
('Recognising and Responding to Goat Pox Outbreaks', 'Livestock', 'goat pox outbreak', ARRAY['goat pox symptoms','capripox vaccine','pox lesions goats'], 362),
('Controlling Mange and Lice in Sheep and Goats', 'Livestock', 'mange lice sheep goats', ARRAY['external parasites goats','sheep ked control','goat skin mites'], 363),
('Setting Up a Creep Feeding System for Kids and Lambs', 'Livestock', 'creep feeding kids lambs', ARRAY['creep feed young stock','lamb supplementary feeding','early kid nutrition'], 364),

-- PETS (365-374)
('Deworming Schedule for Cats', 'Pets', 'cat deworming schedule', ARRAY['cat worms treatment','feline parasites','kitten deworming'], 365),
('Protecting Puppies from Parvovirus', 'Pets', 'puppy parvovirus prevention', ARRAY['canine parvo treatment','parvo vaccine','puppy diarrhoea virus'], 366),
('Heartworm Prevention and Treatment in Dogs', 'Pets', 'dog heartworm prevention', ARRAY['canine heartworm','heartworm medication','mosquito borne dog disease'], 367),
('Rabies Awareness and What to Do After a Dog Bite', 'Pets', 'rabies prevention dog bite', ARRAY['rabies vaccine dogs','post bite first aid','rabies kenya'], 368),
('Whelping: Helping Your Dog Through Birth Safely', 'Pets', 'dog whelping guide', ARRAY['canine birth','whelping box','puppy delivery problems'], 369),
('Microchipping and Travel Health Certificates for Pets', 'Pets', 'pet microchipping travel', ARRAY['pet export kenya','pet passport','microchip dogs cats'], 370),
('Managing Ear Infections in Dogs', 'Pets', 'dog ear infection treatment', ARRAY['canine otitis','dog ear cleaning','ear mites dogs'], 371),
('Recognising and Treating Feline Flu', 'Pets', 'feline flu treatment', ARRAY['cat respiratory infection','cat flu symptoms','feline herpesvirus'], 372),
('Caring for a Pregnant Cat and Newborn Kittens', 'Pets', 'pregnant cat kitten care', ARRAY['queen pregnancy cat','newborn kitten care','cat birth'], 373),
('Toilet Training a Puppy: A Step-by-Step Routine', 'Pets', 'puppy toilet training', ARRAY['house training puppy','puppy potty schedule','crate toilet training'], 374),

-- FEED MILLING -> Feed Manufacturing (375-384)
('Farming Black Soldier Fly Larvae for Animal Feed', 'Feed Manufacturing', 'black soldier fly larvae feed', ARRAY['BSF larvae farming','insect protein feed','larvae composting'], 375),
('Using Insect Meal to Replace Fishmeal in Rations', 'Feed Manufacturing', 'insect meal feed', ARRAY['BSF meal protein','replacing fishmeal','sustainable feed protein'], 376),
('Adding NSP Enzymes to Improve Feed Digestibility', 'Feed Manufacturing', 'feed enzymes NSP', ARRAY['non starch polysaccharide enzyme','phytase feed','feed digestibility'], 377),
('Selecting the Right Toxin Binder for Your Feed', 'Feed Manufacturing', 'toxin binder selection feed', ARRAY['mycotoxin binder','aflatoxin binder feed','feed additive binders'], 378),
('Near-Infrared (NIR) Analysis for Faster Feed QC', 'Feed Manufacturing', 'NIR feed analysis', ARRAY['near infrared feed testing','rapid feed QC','feed moisture protein scanner'], 379),
('Setting Up Feed Mill Inventory and Batch Tracking Software', 'Feed Manufacturing', 'feed mill inventory software', ARRAY['feed batch traceability','mill stock management','feed production software'], 380),
('Calibrating and Maintaining Weighing Scales in a Feed Mill', 'Feed Manufacturing', 'feed mill scale calibration', ARRAY['weigh scale accuracy mill','batching scale maintenance','feed weighing errors'], 381),
('Cutting Boiler and Steam Costs in Pellet Production', 'Feed Manufacturing', 'feed mill steam cost', ARRAY['boiler efficiency pelleting','steam conditioning cost','pellet mill energy'], 382),
('Formulating Rations with Local Byproducts (Brewers Grains, Molasses)', 'Feed Manufacturing', 'feed local byproducts formulation', ARRAY['brewers grains feed','molasses in feed','agro byproduct rations'], 383),
('Feed Mill Worker Safety and PPE Essentials', 'Feed Manufacturing', 'feed mill worker safety', ARRAY['feed mill PPE','mill occupational safety','machine guarding feed mill'], 384),

-- AMR (385-394)
('Phytogenic Feed Additives as Antibiotic Alternatives', 'AMR', 'phytogenic feed additives', ARRAY['plant extracts feed','herbal growth promoter','natural antibiotic alternative'], 385),
('Using Organic Acids to Reduce Antibiotic Use in Poultry', 'AMR', 'organic acids poultry gut', ARRAY['acidifiers poultry feed','gut pH control','organic acid AGP alternative'], 386),
('Probiotics and Prebiotics for Gut Health Without Antibiotics', 'AMR', 'probiotics prebiotics livestock', ARRAY['gut microbiome animals','synbiotics feed','antibiotic free gut health'], 387),
('Bacteriophage Therapy: An Emerging Alternative to Antibiotics', 'AMR', 'bacteriophage therapy livestock', ARRAY['phage therapy animals','alternatives to antibiotics','phage bacteria control'], 388),
('Setting Up an On-Farm Antibiotic Inventory and Audit', 'AMR', 'on-farm antibiotic inventory', ARRAY['antibiotic stock audit','medicine cabinet farm','antimicrobial use tracking'], 389),
('Understanding Maximum Residue Limits (MRLs) in Animal Products', 'AMR', 'maximum residue limits MRL', ARRAY['drug residues meat milk','MRL compliance','residue testing livestock'], 390),
('Selective Dry Cow Therapy to Cut Antibiotic Use', 'AMR', 'selective dry cow therapy', ARRAY['dry cow antibiotics','internal teat sealant','responsible mastitis control'], 391),
('Reducing Antibiotic Use Through Better Calf Housing', 'AMR', 'calf housing reduce antibiotics', ARRAY['calf pen ventilation','disease prevention calves','antibiotic free calf rearing'], 392),
('The Role of Clean Water in Lowering Antibiotic Use', 'AMR', 'clean water antibiotic reduction', ARRAY['water hygiene livestock','waterline sanitation','drinking water biosecurity'], 393),
('Zinc and Copper Alternatives to In-Feed Antibiotics', 'AMR', 'zinc copper feed alternative', ARRAY['zinc oxide piglets','trace mineral gut health','in-feed antibiotic replacement'], 394);
