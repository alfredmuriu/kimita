-- 100 new blog topics (priorities 325-424), 2026-06-22.
-- Keywords chosen to NOT overlap the 242 already-published articles: new veins
-- are aquaculture, beekeeping, rabbits, alternative livestock, poultry
-- diversification, hatchery/incubation, insect-protein feed, pet exotics/specific
-- diseases, and value addition/agribusiness, plus fresh dairy/pig/goat angles.
--
-- Categories are kept to the existing site set that the /articles filters
-- surface: Poultry, Dairy, Pigs, Livestock, Pets, Feed Manufacturing (= "Feed
-- Milling"). Topics in new veins (fish, bees, rabbits, agribusiness, goats/sheep)
-- are folded into Livestock so they still appear under a filter button.
--
-- `used` defaults to false; the generator claims the lowest unused priority first.

INSERT INTO blog_topics (topic, category, primary_keyword, secondary_keywords, priority) VALUES
-- Aquaculture / Fish -> Livestock (325-336)
('Starting a Tilapia Fish Pond on a Small Farm', 'Livestock', 'tilapia farming kenya', ARRAY['fish pond setup','tilapia stocking density','freshwater aquaculture'], 325),
('Catfish Farming: From Fingerling to Market', 'Livestock', 'catfish farming guide', ARRAY['african catfish','clarias farming','catfish stocking'], 326),
('How to Construct a Liner Fish Pond Cheaply', 'Livestock', 'fish pond construction', ARRAY['pond liner installation','earthen fish pond','dam liner pond'], 327),
('Formulating Low-Cost Fish Feed on the Farm', 'Livestock', 'fish feed formulation', ARRAY['homemade tilapia feed','catfish feed recipe','floating fish feed'], 328),
('Sourcing Quality Fingerlings and Avoiding Stunted Stock', 'Livestock', 'fish fingerlings sourcing', ARRAY['tilapia fingerlings','sex-reversed fingerlings','hatchery fingerlings'], 329),
('Managing Water Quality in Fish Ponds', 'Livestock', 'fish pond water quality', ARRAY['pond oxygen levels','ammonia in fish ponds','pond water testing'], 330),
('Cage Fish Farming in Lakes and Dams', 'Livestock', 'cage fish farming', ARRAY['floating cage aquaculture','lake fish cages','cage stocking density'], 331),
('Common Tilapia Diseases and How to Treat Them', 'Livestock', 'tilapia diseases treatment', ARRAY['fish fungal infection','fish parasites','aquaculture biosecurity'], 332),
('Setting Up a Backyard Aquaponics System', 'Livestock', 'aquaponics setup', ARRAY['fish and vegetable farming','aquaponics grow bed','integrated aquaculture'], 333),
('Harvesting and Marketing Farmed Fish for Profit', 'Livestock', 'selling farmed fish', ARRAY['fish market kenya','fish value addition','smoked fish business'], 334),
('Polyculture: Raising Tilapia and Catfish Together', 'Livestock', 'fish polyculture farming', ARRAY['mixed fish stocking','predator prey fish pond','pond productivity'], 335),
('Feeding Schedules and Growth Rates for Pond Fish', 'Livestock', 'fish feeding schedule', ARRAY['fish feed conversion ratio','tilapia growth rate','daily feeding rate fish'], 336),

-- Beekeeping / Apiculture -> Livestock (337-344)
('Starting Beekeeping with Langstroth Hives', 'Livestock', 'beekeeping for beginners kenya', ARRAY['langstroth hive','modern beekeeping','apiary setup'], 337),
('Siting and Setting Up a Productive Apiary', 'Livestock', 'apiary site selection', ARRAY['bee hive placement','apiary spacing','bee forage proximity'], 338),
('Harvesting and Processing Honey Hygienically', 'Livestock', 'honey harvesting processing', ARRAY['honey extraction','honey settling tank','clean honey handling'], 339),
('Controlling Varroa Mites and Wax Moths in Hives', 'Livestock', 'bee pest control', ARRAY['varroa mite treatment','wax moth prevention','hive beetle control'], 340),
('Preventing Bee Colony Absconding and Swarming', 'Livestock', 'bee absconding prevention', ARRAY['colony swarming control','bee colony management','queen management'], 341),
('Best Bee Forage Plants to Grow Around Your Apiary', 'Livestock', 'bee forage plants', ARRAY['nectar plants for bees','pollinator plants','honey flow plants'], 342),
('Adding Value: Beeswax, Propolis and Comb Honey', 'Livestock', 'beeswax propolis products', ARRAY['bee product value addition','propolis harvesting','comb honey market'], 343),
('Catching and Baiting Wild Bee Swarms', 'Livestock', 'baiting bee swarms', ARRAY['bee swarm catcher box','attracting bees to hive','swarm lure'], 344),

-- Rabbits -> Livestock (345-352)
('Rabbit Farming Startup: Breeds, Housing and Markets', 'Livestock', 'rabbit farming startup kenya', ARRAY['meat rabbit breeds','rabbit business plan','rabbit market'], 345),
('Designing a Hygienic Rabbit Hutch', 'Livestock', 'rabbit hutch design', ARRAY['rabbit cage construction','rabbit housing ventilation','hutch flooring'], 346),
('Rabbit Breeding and Kindling Management', 'Livestock', 'rabbit breeding management', ARRAY['doe kindling','rabbit gestation','nest box rabbits'], 347),
('Feeding Rabbits: Pellets, Forage and Greens', 'Livestock', 'rabbit feeding guide', ARRAY['rabbit pellet feed','forage for rabbits','rabbit nutrition'], 348),
('Treating Coccidiosis, Snuffles and Ear Mites in Rabbits', 'Livestock', 'rabbit diseases treatment', ARRAY['rabbit coccidiosis','snuffles rabbits','ear canker rabbits'], 349),
('Collecting Rabbit Urine for Organic Foliar Feed', 'Livestock', 'rabbit urine fertilizer', ARRAY['rabbit urine biopesticide','organic foliar feed','rabbit urine collection'], 350),
('How to Sex Rabbits and Select Breeding Stock', 'Livestock', 'sexing rabbits', ARRAY['rabbit gender identification','selecting breeding rabbits','buck doe selection'], 351),
('Marketing Rabbit Meat and Building Demand', 'Livestock', 'selling rabbit meat', ARRAY['rabbit meat market kenya','rabbit meat buyers','rabbit value addition'], 352),

-- Alternative livestock -> Livestock (353-357)
('Camel Husbandry and Milk Production in Arid Areas', 'Livestock', 'camel milk farming', ARRAY['camel husbandry kenya','camel milk market','dromedary management'], 353),
('Donkey Health, Harnessing and Welfare', 'Livestock', 'donkey welfare care', ARRAY['donkey health management','working donkey care','donkey hoof care'], 354),
('Guinea Pig (Cavy) Rearing for Meat', 'Livestock', 'guinea pig farming', ARRAY['cavy rearing','guinea pig meat','cavy housing'], 355),
('Greater Cane Rat (Grasscutter) Farming Basics', 'Livestock', 'grasscutter farming', ARRAY['cane rat rearing','grasscutter housing','rodent meat farming'], 356),
('Ostrich and Emu: Is Ratite Farming Viable in Kenya', 'Livestock', 'ostrich farming kenya', ARRAY['ratite farming','ostrich meat','ostrich enterprise'], 357),

-- Poultry diversification: ducks, turkey, quail, geese, guinea fowl -> Poultry (358-367)
('Duck Farming for Meat and Eggs', 'Poultry', 'duck farming guide', ARRAY['raising ducks kenya','duck housing','duck egg production'], 358),
('Commercial Turkey Production for the Festive Market', 'Poultry', 'turkey farming festive market', ARRAY['turkey rearing','christmas turkey','turkey fattening'], 359),
('Quail Egg Production and Marketing', 'Poultry', 'quail egg production', ARRAY['quail egg business','coturnix quail','quail egg health benefits'], 360),
('Raising Guinea Fowl for Pest Control and Meat', 'Poultry', 'guinea fowl farming', ARRAY['keets rearing','guinea fowl free range','guinea fowl eggs'], 361),
('Geese Farming as Natural Weeders and Guards', 'Poultry', 'geese farming', ARRAY['raising geese','goose meat','geese as guards'], 362),
('Brooding Ducklings and Keets Successfully', 'Poultry', 'brooding ducklings keets', ARRAY['waterfowl brooding','keet brooding temperature','duckling care'], 363),
('Pigeon (Squab) Keeping for Meat and Sport', 'Poultry', 'pigeon keeping squab', ARRAY['squab production','racing pigeons','pigeon loft'], 364),
('Comparing Duck Breeds: Khaki Campbell, Pekin and Muscovy', 'Poultry', 'duck breeds comparison', ARRAY['pekin duck','muscovy duck','khaki campbell layer'], 365),
('Feeding Waterfowl Differently from Chickens', 'Poultry', 'waterfowl feeding', ARRAY['duck feed niacin','goose forage','waterfowl nutrition'], 366),
('Turkey Diseases: Blackhead and Fowl Pox Management', 'Poultry', 'turkey diseases', ARRAY['blackhead disease turkey','histomoniasis','fowl pox turkey'], 367),

-- Hatchery and incubation -> Poultry (368-374)
('Setting Up a Small Egg Incubator at Home', 'Poultry', 'egg incubator setup', ARRAY['incubation temperature humidity','homemade incubator','hatching eggs'], 368),
('Candling Eggs to Track Embryo Development', 'Poultry', 'candling eggs', ARRAY['egg candling guide','infertile egg detection','embryo development'], 369),
('Improving Hatchability and Reducing Dead-in-Shell', 'Poultry', 'improving hatchability', ARRAY['low hatch rate causes','dead in shell','hatch window'], 370),
('Selecting and Storing Fertile Eggs for Incubation', 'Poultry', 'fertile egg selection storage', ARRAY['hatching egg storage','egg fertility','setting eggs'], 371),
('Running a Profitable Day-Old Chick Hatchery', 'Poultry', 'chick hatchery business', ARRAY['day old chick supply','hatchery management','chick sales'], 372),
('Natural Incubation: Managing Broody Hens', 'Poultry', 'broody hen management', ARRAY['natural egg hatching','setting broody hen','mother hen chicks'], 373),
('Troubleshooting Incubator Humidity and Turning Problems', 'Poultry', 'incubator humidity problems', ARRAY['egg turning frequency','sticky chicks','incubator ventilation'], 374),

-- Poultry new angles -> Poultry (375-380)
('Grading, Packaging and Branding Eggs for Better Prices', 'Poultry', 'egg grading packaging', ARRAY['egg sizing','egg carton branding','premium egg market'], 375),
('Securing Egg and Chicken Supply Contracts', 'Poultry', 'poultry supply contracts', ARRAY['selling eggs supermarkets','broiler offtake agreement','poultry market linkage'], 376),
('Choosing a Brooder Heat Source: Charcoal, Gas or Infrared', 'Poultry', 'brooder heat source comparison', ARRAY['infrared brooder','gas brooder','charcoal jiko brooding'], 377),
('Vaccinating Poultry Through Drinking Water Correctly', 'Poultry', 'drinking water vaccination poultry', ARRAY['water vaccine technique','vaccine stabilizer','mass poultry vaccination'], 378),
('Pasture-Raised Broilers: Economics and Management', 'Poultry', 'pasture raised broilers', ARRAY['free range broiler','chicken tractor broilers','organic broiler'], 379),
('Tracking Flock Performance and Feed Conversion', 'Poultry', 'poultry record keeping', ARRAY['flock performance records','broiler FCR tracking','layer production records'], 380),

-- Dairy new angles -> Dairy (381-388)
('Treating Calf Scours with Oral Rehydration', 'Dairy', 'calf scours treatment', ARRAY['calf diarrhoea','oral rehydration calves','scours electrolytes'], 381),
('Disbudding and Dehorning Calves Safely', 'Dairy', 'calf dehorning disbudding', ARRAY['disbudding paste','calf horn removal','dehorning iron'], 382),
('DIY Artificial Insemination vs Hiring a Technician', 'Dairy', 'dairy artificial insemination cost', ARRAY['DIY AI cattle','AI technician kenya','semen straw handling'], 383),
('Using Sexed Semen to Get More Heifer Calves', 'Dairy', 'sexed semen dairy', ARRAY['sexed semen cost benefit','heifer calf selection','dairy genetics'], 384),
('Setting Up Hydroponic Barley Fodder', 'Dairy', 'hydroponic fodder setup', ARRAY['barley fodder system','sprouted fodder','hydroponic green feed'], 385),
('Growing Azolla as a Cheap Protein Supplement', 'Dairy', 'azolla protein supplement', ARRAY['azolla cultivation','azolla livestock feed','azolla pond'], 386),
('Establishing Calliandra and Leucaena Protein Banks', 'Dairy', 'fodder protein banks', ARRAY['calliandra fodder','leucaena trees','protein forage shrubs'], 387),
('Recognising and Managing Lumpy Skin Disease', 'Dairy', 'lumpy skin disease cattle', ARRAY['LSD cattle treatment','lumpy skin vaccine','skin nodules cattle'], 388),

-- Pigs new angles -> Pigs (389-394)
('Smallholder Pork Value Addition: Sausages and Bacon', 'Pigs', 'pork value addition', ARRAY['pork sausage making','bacon curing smallholder','processed pork'], 389),
('Choosing Healthy Weaners When Buying Pigs', 'Pigs', 'choosing weaner pigs', ARRAY['buying weaners','healthy piglet selection','weaner pig checklist'], 390),
('Feeding Sweet Potato Vines and Forage to Pigs', 'Pigs', 'sweet potato vines pig feed', ARRAY['forage for pigs','pig roughage','cheap pig feed greens'], 391),
('Recognising and Controlling Swine Dysentery', 'Pigs', 'swine dysentery control', ARRAY['bloody diarrhoea pigs','pig gut health','dysentery treatment swine'], 392),
('Keeping Practical Pig Production Records', 'Pigs', 'pig record keeping', ARRAY['piggery records','sow productivity tracking','pig performance targets'], 393),
('Managing Boar Taint in Entire Male Pigs', 'Pigs', 'boar taint management', ARRAY['entire male pigs','boar taint causes','immunocastration'], 394),

-- Goats and sheep new angles -> Livestock (395-402)
('Dorper Sheep Farming for Fast Meat Production', 'Livestock', 'dorper sheep farming', ARRAY['dorper breed','meat sheep kenya','dorper fattening'], 395),
('Hair Sheep vs Wool Sheep: Which Suits Your Farm', 'Livestock', 'hair sheep vs wool sheep', ARRAY['red maasai sheep','wool sheep kenya','sheep breed selection'], 396),
('Fattening Sheep for the Eid and Festive Market', 'Livestock', 'fattening sheep eid market', ARRAY['sheep fattening ration','ram finishing','festive sheep market'], 397),
('Vaccinating Against Enterotoxaemia (Pulpy Kidney)', 'Livestock', 'enterotoxaemia vaccine sheep goats', ARRAY['pulpy kidney disease','clostridial vaccine','overeating disease'], 398),
('Treating Caseous Lymphadenitis Abscesses in Goats', 'Livestock', 'caseous lymphadenitis goats', ARRAY['goat abscess treatment','CLA goats','lymph node abscess'], 399),
('Mixing an Effective Footbath for Foot Rot', 'Livestock', 'footbath foot rot sheep goats', ARRAY['zinc sulphate footbath','copper sulphate footbath','hoof rot control'], 400),
('Artificial Insemination in Goats: Is It Worth It', 'Livestock', 'goat artificial insemination', ARRAY['goat AI kenya','dairy goat genetics','synchronising does AI'], 401),
('Recognising and Responding to Goat Pox Outbreaks', 'Livestock', 'goat pox outbreak', ARRAY['goat pox symptoms','capripox vaccine','pox lesions goats'], 402),

-- Insect protein and novel feed -> Feed Manufacturing (403-408)
('Farming Black Soldier Fly Larvae for Animal Feed', 'Feed Manufacturing', 'black soldier fly larvae feed', ARRAY['BSF larvae farming','insect protein feed','larvae composting'], 403),
('Using Insect Meal to Replace Fishmeal in Rations', 'Feed Manufacturing', 'insect meal feed', ARRAY['BSF meal protein','replacing fishmeal','sustainable feed protein'], 404),
('Growing Maggots Hygienically for Poultry Protein', 'Feed Manufacturing', 'maggot farming poultry feed', ARRAY['maggot production','fly larvae chicken feed','protein for kienyeji'], 405),
('Adding NSP Enzymes to Improve Feed Digestibility', 'Feed Manufacturing', 'feed enzymes NSP', ARRAY['non starch polysaccharide enzyme','phytase feed','feed digestibility'], 406),
('Selecting the Right Toxin Binder for Your Feed', 'Feed Manufacturing', 'toxin binder selection feed', ARRAY['mycotoxin binder','aflatoxin binder feed','feed additive binders'], 407),
('Earthworm (Vermiculture) Protein for Livestock', 'Feed Manufacturing', 'earthworm protein livestock', ARRAY['vermiculture feed','earthworm meal','worm farming protein'], 408),

-- Pets new angles: exotics and specific diseases -> Pets (409-416)
('Keeping Aquarium Fish: A Beginner Setup Guide', 'Pets', 'aquarium fish keeping', ARRAY['home aquarium setup','tropical fish care','fish tank cycling'], 409),
('Caring for Caged Birds: Lovebirds and Budgies', 'Pets', 'caged bird care', ARRAY['lovebird care','budgie keeping','pet bird cage'], 410),
('Deworming Schedule for Cats', 'Pets', 'cat deworming schedule', ARRAY['cat worms treatment','feline parasites','kitten deworming'], 411),
('Protecting Puppies from Parvovirus', 'Pets', 'puppy parvovirus prevention', ARRAY['canine parvo treatment','parvo vaccine','puppy diarrhoea virus'], 412),
('Heartworm Prevention and Treatment in Dogs', 'Pets', 'dog heartworm prevention', ARRAY['canine heartworm','heartworm medication','mosquito borne dog disease'], 413),
('Rabies Awareness and What to Do After a Dog Bite', 'Pets', 'rabies prevention dog bite', ARRAY['rabies vaccine dogs','post bite first aid','rabies kenya'], 414),
('Whelping: Helping Your Dog Through Birth Safely', 'Pets', 'dog whelping guide', ARRAY['canine birth','whelping box','puppy delivery problems'], 415),
('Microchipping and Travel Health Certificates for Pets', 'Pets', 'pet microchipping travel', ARRAY['pet export kenya','pet passport','microchip dogs cats'], 416),

-- Value addition and agribusiness (417-424): dairy products -> Dairy, rest -> Livestock
('Making and Marketing Mala and Yoghurt', 'Dairy', 'mala yoghurt value addition', ARRAY['fermented milk business','yoghurt processing','dairy value addition'], 417),
('Building a Small Milk ATM Vending Business', 'Dairy', 'milk ATM business', ARRAY['milk vending machine','raw milk dispenser','milk bar business'], 418),
('Starting and Stocking a Profitable Agrovet Shop', 'Livestock', 'agrovet shop business', ARRAY['agrovet startup kenya','animal health retail','agrovet stock'], 419),
('Understanding Livestock Insurance and Claims', 'Livestock', 'livestock insurance kenya', ARRAY['cattle insurance','index livestock insurance','livestock claim process'], 420),
('Maintaining a Cold Chain for Vaccines on the Farm', 'Livestock', 'vaccine cold chain', ARRAY['vaccine storage fridge','cool box vaccines','vaccine handling'], 421),
('Accessing Agribusiness Loans and Asset Finance', 'Livestock', 'agribusiness loans kenya', ARRAY['farmer loans','livestock asset finance','agri credit'], 422),
('Forming a Dairy or Poultry Cooperative', 'Livestock', 'farmer cooperative formation', ARRAY['SACCO dairy farmers','marketing cooperative','group bargaining'], 423),
('Branding and Packaging Farm Products for Retail', 'Livestock', 'farm product branding packaging', ARRAY['agribusiness branding','product labelling kenya','retail packaging'], 424);
