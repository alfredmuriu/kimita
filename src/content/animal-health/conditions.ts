// The condition list for the animal-health library. Each entry becomes a card on
// its animal's page and a detailed page at /animal-health-signs/<species>/<id>.
//
// This file is the human-controlled spine: which conditions exist, how urgent
// they are, and whether they are notifiable. The long-form text (card copy,
// detail sections, product suggestions, image prompt) lives in
// generated/<species>.json, written by scripts/generate-animal-health-content.mjs
// from these entries and reviewed before publishing.
//
// Images live at public/images/animal-health/<species>/<id>.webp.
//   photo 'ai'      → AI placeholder, labelled on the page
//   photo 'real'    → real photo, no label
//   photo 'pending' → no usable image yet; the card shows a text panel
//
// Kept import-free so Node scripts can load it directly.

export type Urgency = 'normal' | 'watch' | 'vet' | 'emergency'
export type Photo = 'ai' | 'real' | 'pending'

export interface ConditionSpec {
  species: string
  id: string
  name: string
  urgency: Urgency
  /** Notifiable in Kenya — report to the County Veterinary Officer. */
  report: boolean
  /** One-line brief for the writer: cause and the headline visible sign. */
  brief: string
  photo: Photo
}

type Row = [id: string, name: string, urgency: Urgency, brief: string, opts?: { report?: boolean; photo?: Photo }]

function group(species: string, rows: Row[]): ConditionSpec[] {
  return rows.map(([id, name, urgency, brief, opts]) => ({
    species,
    id,
    name,
    urgency,
    brief,
    report: opts?.report ?? false,
    photo: opts?.photo ?? 'ai',
  }))
}

const R = { report: true }

export const CONDITIONS: ConditionSpec[] = [
  ...group('cattle', [
    ['healthy', 'What a healthy cow looks like', 'normal', 'Baseline: normal behaviour, temperature 38–39.5 °C, heart and breathing rates, rumination, dung, coat, eyes, nose; a daily health-check routine.'],
    ['east-coast-fever', 'East Coast Fever', 'emergency', 'Theileria parva spread by brown ear ticks; swollen lymph nodes below the ear and in front of the shoulder, high fever, laboured breathing, froth at the nose; high death rate in exotic breeds and calves.'],
    ['anaplasmosis', 'Anaplasmosis (gall sickness)', 'vet', 'Anaplasma marginale spread by ticks and needles; pale then yellow eyes and gums, weakness, constipation, weight loss; worse in adult cattle.'],
    ['babesiosis', 'Babesiosis (redwater)', 'emergency', 'Babesia bigemina/bovis spread by blue ticks; red-brown "coffee" urine, high fever, pale gums, jaundice; cerebral form with nervous signs.'],
    ['heartwater', 'Heartwater', 'emergency', 'Ehrlichia ruminantium spread by bont ticks; high fever followed by nervous signs — high-stepping walk, chewing movements, circling, paddling; sudden death.'],
    ['foot-and-mouth-disease', 'Foot-and-mouth disease (FMD)', 'emergency', 'Picornavirus; drooling, blisters on tongue, gums, teats and between the claws, lameness, sharp milk drop; spreads very fast to all cloven-hoofed animals.', R],
    ['lumpy-skin-disease', 'Lumpy skin disease', 'emergency', 'Capripox virus spread by biting flies and ticks; firm round skin nodules over the body, fever, swollen lymph nodes, milk drop, leg swelling.', R],
    ['cbpp', 'Contagious bovine pleuropneumonia (CBPP)', 'emergency', 'Mycoplasma mycoides; cough, laboured breathing with extended neck, pain on pressing the chest, fever; spreads by close contact in herds and markets.', R],
    ['anthrax', 'Anthrax', 'emergency', 'Bacillus anthracis spores in soil; sudden death with dark unclotted blood from nose, mouth and anus, rapid bloating, no rigor mortis. Carcass must NOT be opened. Dangerous to people.', R],
    ['blackleg', 'Blackleg (black quarter)', 'emergency', 'Clostridium chauvoei; young well-fed cattle 6 months–2 years, sudden lameness, hot then cold crackling swelling in heavy muscles, rapid death; preventable by vaccine.'],
    ['rift-valley-fever', 'Rift Valley fever', 'emergency', 'Mosquito-borne virus after heavy rains/floods; waves of abortions, high deaths in calves, fever, bloody diarrhoea, nasal discharge. Infects people.', R],
    ['brucellosis', 'Brucellosis (contagious abortion)', 'vet', 'Brucella abortus; abortion in late pregnancy, retained placenta, weak calves, swollen joints/testes; major human health risk through raw milk and handling births.'],
    ['trypanosomiasis', 'Trypanosomiasis (nagana)', 'vet', 'Trypanosomes spread by tsetse flies; slow wasting, anaemia, intermittent fever, swollen lymph nodes, poor milk, abortion, tears from eyes.'],
    ['rabies', 'Rabies', 'emergency', 'Rabies virus from bites of dogs and wild carnivores; bellowing, drooling, aggression or dullness, paralysis, straining, death. Fatal to people — never put hands in the mouth.', R],
    ['mastitis', 'Mastitis', 'vet', 'Bacterial udder infection; hot, hard, swollen or painful quarter, clots/flakes/watery milk, sometimes fever and off feed; subclinical form only shows on CMT test.'],
    ['milk-fever', 'Milk fever (hypocalcaemia)', 'emergency', 'Low blood calcium around calving in high-yielding cows; wobbly walk, cold ears, S-shaped neck, lying down with head turned to the flank, unable to rise.'],
    ['ketosis', 'Ketosis (acetonaemia)', 'vet', 'Energy shortage in early lactation; drop in appetite and milk, sweet acetone smell on breath, rapid weight loss, sometimes nervous signs.'],
    ['bloat', 'Bloat', 'emergency', 'Gas trapped in the rumen (frothy from legumes/grain or free gas from blockage); left flank swollen high and tight, distress, laboured breathing, sudden death.'],
    ['foot-rot', 'Foot rot and lameness', 'vet', 'Fusobacterium necrophorum infection between the claws, worse in mud; sudden lameness, swelling above the hoof, foul-smelling crack between claws; also covers sole ulcers and laminitis briefly.'],
    ['pinkeye', 'Pinkeye (infectious keratoconjunctivitis)', 'vet', 'Moraxella bovis spread by flies, dust and grass seeds; tears, squinting, red eye, white-blue cloudy patch on the eye, ulcer.'],
    ['calf-scours', 'Calf scours (diarrhoea)', 'vet', 'E. coli, rotavirus, coronavirus, cryptosporidium, salmonella; watery yellow/white diarrhoea, dehydration, sunken eyes, weakness in calves under a month; colostrum management.'],
    ['calf-pneumonia', 'Calf pneumonia', 'vet', 'Mixed viral and bacterial respiratory infection in calves; cough, nasal discharge, fast breathing, droopy ears, fever; poor ventilation and damp housing.'],
    ['internal-worms', 'Internal worms (roundworms)', 'watch', 'Gastrointestinal nematodes; rough coat, weight loss, pot belly, diarrhoea, poor growth in young stock; strategic deworming and resistance.'],
    ['liver-fluke', 'Liver fluke (fascioliasis)', 'vet', 'Fasciola gigantica from snails on wet grazing; weight loss, bottle jaw, anaemia, drop in milk, liver condemnation at slaughter.'],
    ['tick-infestation', 'Tick infestation', 'watch', 'Ticks on ears, udder, tail and between legs; blood loss, skin damage, teat damage, and the diseases they carry; acaricide spraying and dipping schedules and resistance.'],
    ['ringworm', 'Ringworm', 'watch', 'Trichophyton fungus; round grey crusty hairless patches around eyes, neck, in young stock; spreads to people.'],
    ['retained-placenta', 'Retained placenta (afterbirth)', 'vet', 'Afterbirth not passed within 12–24 hours of calving; hanging membranes, foul smell, fever, uterine infection risk; nutrition and hygiene causes.'],
    ['heat-stress', 'Heat stress', 'watch', 'High temperature and humidity in exotic dairy breeds; panting, drooling, seeking shade, drop in feed intake and milk; shade, water and management.'],
    ['mycotoxin-poisoning', 'Mycotoxin poisoning (mouldy feed)', 'vet', 'Aflatoxin and other toxins from mouldy maize, dairy meal and silage; poor appetite, drop in milk, liver damage, reduced fertility; aflatoxin passes into milk.'],
    ['mineral-deficiency', 'Mineral deficiency and pica', 'watch', 'Phosphorus, calcium, copper, cobalt, selenium deficiency; chewing bones, wood and soil, poor fertility, poor growth, faded coat, weak bones.'],
  ]),

  ...group('goats', [
    ['healthy', 'What a healthy goat looks like', 'normal', 'Baseline: behaviour, temperature 38.5–40 °C, pellet droppings, pink inner eyelids (FAMACHA), coat, cud chewing; daily check routine.'],
    ['ppr', 'Peste des petits ruminants (PPR)', 'emergency', 'Morbillivirus ("goat plague"); fever, eye and nose discharge that crusts, mouth sores, foul breath, diarrhoea, pneumonia, high deaths.', R],
    ['ccpp', 'Contagious caprine pleuropneumonia (CCPP)', 'emergency', 'Mycoplasma capricolum capripneumoniae; high fever, cough, laboured breathing with extended neck, frothy nasal discharge, many goats affected.', R],
    ['goat-pox', 'Goat pox', 'emergency', 'Capripox virus; fever, skin nodules and scabs on hairless areas (lips, udder, under tail), swollen lymph nodes, breathing problems.', R],
    ['haemonchosis', "Barber's pole worm (haemonchosis)", 'vet', 'Haemonchus contortus blood-sucking worm; pale inner eyelids, bottle jaw, weakness, sudden death in wet season; FAMACHA scoring, targeted deworming, resistance.'],
    ['coccidiosis', 'Coccidiosis in kids', 'vet', 'Eimeria parasites in crowded damp pens; diarrhoea sometimes bloody, straining, poor growth, dehydration in kids 3 weeks–5 months.'],
    ['enterotoxaemia', 'Enterotoxaemia (pulpy kidney)', 'emergency', 'Clostridium perfringens type D after sudden feed changes or grain; sudden death in best-growing kids, convulsions, diarrhoea; vaccine-preventable.'],
    ['pneumonia', 'Pneumonia (pasteurellosis)', 'vet', 'Mannheimia/Pasteurella after stress, transport, cold; cough, fever, nasal discharge, fast breathing; differs from CCPP.'],
    ['orf', 'Orf (contagious ecthyma)', 'watch', 'Parapoxvirus; crusty wart-like scabs on lips, nostrils, udder; kids struggle to suckle; spreads to people.'],
    ['foot-rot', 'Foot rot', 'vet', 'Dichelobacter nodosus and Fusobacterium; lameness, grazing on knees, red moist skin between toes, foul smell; trimming, foot baths.'],
    ['caseous-lymphadenitis', 'Caseous lymphadenitis (CL)', 'vet', 'Corynebacterium pseudotuberculosis; firm abscesses at lymph nodes near jaw, neck, shoulder that burst with thick cheesy pus; chronic, contagious.'],
    ['mange', 'Mange and lice', 'watch', 'Sarcoptes, Psoroptes, Demodex mites and lice; itching, hair loss, thick crusty skin, rubbing.'],
    ['mastitis', 'Mastitis', 'vet', 'Udder infection in does; hot, swollen, hard half, abnormal milk, gangrenous form with blue cold udder.'],
    ['pregnancy-toxaemia', 'Pregnancy toxaemia', 'emergency', 'Energy shortage in late pregnancy with twins/triplets; dullness, separation from herd, blindness, teeth grinding, lying down; nutrition in late gestation.'],
    ['bloat', 'Bloat', 'emergency', 'Rumen gas from lush legumes or grain; swollen left side, distress, laboured breathing.'],
    ['heartwater', 'Heartwater', 'emergency', 'Ehrlichia ruminantium via bont ticks; fever then nervous signs, circling, paddling, sudden death.'],
    ['white-muscle-disease', 'White muscle disease', 'vet', 'Vitamin E and selenium deficiency; stiff weak kids, trouble standing or suckling, sudden death from heart damage.'],
    ['brucellosis', 'Brucellosis', 'vet', 'Brucella melitensis; late abortions, retained afterbirth, weak kids; serious human disease via raw milk and birth fluids.'],
  ]),

  ...group('sheep', [
    ['healthy', 'What a healthy sheep looks like', 'normal', 'Baseline: flocking behaviour, temperature 38.5–40 °C, pink eyelids, firm pellets, fleece condition, cud chewing; daily check.'],
    ['sheep-pox', 'Sheep pox', 'emergency', 'Capripox virus; fever, skin nodules turning to scabs on woolless skin, eye and nose discharge, pneumonia, high deaths in lambs.', R],
    ['bluetongue', 'Bluetongue', 'vet', 'Culicoides midge-borne virus in wet seasons; fever, swollen face and lips, drooling, blue-purple tongue in some, lameness, coronet band redness.'],
    ['nairobi-sheep-disease', 'Nairobi sheep disease', 'emergency', 'Tick-borne virus (brown ear tick) when sheep move to tick areas; high fever, foul bloody diarrhoea, nasal discharge, high deaths.'],
    ['haemonchosis', "Barber's pole worm (haemonchosis)", 'vet', 'Haemonchus contortus; pale eyelids, bottle jaw, weakness, sudden deaths after rains; FAMACHA and targeted deworming.'],
    ['liver-fluke', 'Liver fluke', 'vet', 'Fasciola spp. from snails on wet pasture; sudden death (acute) or wasting, bottle jaw, anaemia (chronic).'],
    ['foot-rot', 'Foot rot', 'vet', 'Dichelobacter nodosus; lameness, foul-smelling separation of hoof horn, grazing on knees; foot bathing, trimming, culling chronic carriers.'],
    ['enterotoxaemia', 'Enterotoxaemia (pulpy kidney)', 'emergency', 'Clostridium perfringens type D; sudden death in fast-growing lambs after feed change; vaccination.'],
    ['fly-strike', 'Fly strike (myiasis)', 'vet', 'Blowfly or screwworm maggots in soiled wool or wounds; restless, foul-smelling damp wool, maggots in wound, rapid decline.'],
    ['pregnancy-toxaemia', 'Pregnancy toxaemia (twin lamb disease)', 'emergency', 'Low energy in late pregnancy with twins; dullness, star-gazing, blindness, recumbency.'],
    ['sheep-scab', 'Sheep scab and lice', 'watch', 'Psoroptes ovis mites and lice; intense itching, wool loss, yellow crusts, rubbing, biting fleece.'],
    ['rift-valley-fever', 'Rift Valley fever', 'emergency', 'Mosquito-borne virus after floods; abortion storms, very high lamb deaths, fever. Infects people.', R],
    ['pneumonia', 'Pneumonia', 'vet', 'Pasteurellosis and mixed infections after stress; cough, nasal discharge, fever, laboured breathing.'],
  ]),

  ...group('poultry', [
    ['healthy', 'What a healthy chicken looks like', 'normal', 'Baseline: bright red comb in layers, clear eyes, tight feathers, normal droppings with white cap, active scratching, normal feed and water intake per age; daily flock check.'],
    ['newcastle-disease', 'Newcastle disease', 'emergency', 'Avian paramyxovirus; twisted neck, paralysis, gasping, green watery diarrhoea, sudden egg drop and deaths; vaccination schedule.', R],
    ['avian-influenza', 'Avian influenza (bird flu)', 'emergency', 'Influenza A; swollen head, purple comb and wattles, red legs, sudden high deaths; human health risk.', R],
    ['gumboro', 'Gumboro (infectious bursal disease)', 'emergency', 'Birnavirus in chicks 3–6 weeks; sudden ruffled huddled birds, white watery diarrhoea, pecking at vent, deaths peak then fall; immune suppression afterwards.'],
    ['infectious-bronchitis', 'Infectious bronchitis', 'vet', 'Coronavirus; gasping, rales, sneezing in chicks; egg drop with soft, wrinkled, pale shells and watery whites in layers.'],
    ['mareks-disease', "Marek's disease", 'vet', 'Herpesvirus; paralysis with one leg forward one back, grey irregular pupils, tumours, wasting in birds 6–20 weeks; vaccination at hatchery.'],
    ['fowl-pox', 'Fowl pox', 'watch', 'Avipoxvirus spread by mosquitoes; dry form wart-like scabs on comb and wattles; wet form yellow plaques in mouth and throat.'],
    ['coccidiosis', 'Coccidiosis', 'vet', 'Eimeria parasites, wet litter; bloody or mucoid droppings, ruffled hunched birds, pale combs, poor growth, deaths in growers.'],
    ['crd', 'Chronic respiratory disease (mycoplasmosis)', 'vet', 'Mycoplasma gallisepticum; sneezing, rattling breath, foamy eyes, swollen sinuses, slow spread, reduced egg production; passes through eggs.'],
    ['infectious-coryza', 'Infectious coryza', 'vet', 'Avibacterium paragallinarum; swollen face, foul-smelling nasal discharge, eyes stuck shut, egg drop; spreads in multi-age flocks.'],
    ['fowl-typhoid', 'Fowl typhoid and pullorum', 'vet', 'Salmonella Gallinarum/Pullorum; dull droopy birds, pale combs, yellow-green diarrhoea, chick deaths with pasted vents; egg-transmitted.'],
    ['fowl-cholera', 'Fowl cholera', 'emergency', 'Pasteurella multocida; sudden deaths in adult birds, purple comb, swollen wattles and joints, green diarrhoea.'],
    ['colibacillosis', 'Colibacillosis (E. coli infection)', 'vet', 'E. coli secondary to poor hygiene, ammonia, other diseases; dull birds, airsacculitis, swollen joints, chick yolk infections.'],
    ['necrotic-enteritis', 'Necrotic enteritis', 'vet', 'Clostridium perfringens in broilers, often after coccidiosis or diet change; sudden deaths, dark sticky droppings, depression.'],
    ['omphalitis', 'Navel and yolk sac infection (omphalitis)', 'vet', 'Bacterial infection through unhealed navel in chicks 0–7 days; swollen wet navel, big soft belly, chicks huddled under heat, early deaths; hatchery and brooding hygiene.'],
    ['mycotoxicosis', 'Mycotoxin poisoning (aflatoxicosis)', 'vet', 'Aflatoxin and other toxins in mouldy feed; poor growth, pale birds, bruising, egg drop, immune suppression, vaccine failure.'],
    ['heat-stress', 'Heat stress', 'watch', 'High temperatures; panting open-mouthed, wings held away from body, drinking a lot, thin shells, sudden deaths in heavy broilers.'],
    ['fatty-liver', 'Fatty liver haemorrhagic syndrome', 'vet', 'Overweight caged layers on high-energy feed; sudden deaths of good layers, pale combs, egg drop; liver bleeding.'],
    ['vitamin-deficiency', 'Vitamin deficiencies', 'watch', 'Vitamins A, D3, E, B2 (riboflavin), B1; rickets and soft beaks, curled toes, stargazing/crazy chick disease, eye discharge, poor hatchability.'],
    ['leg-weakness', 'Leg weakness and perosis', 'watch', 'Fast broiler growth, manganese/choline/biotin deficiency, calcium-phosphorus imbalance; slipped tendons, bowed legs, sitting birds.'],
    ['poor-eggshell-quality', 'Poor eggshell quality and egg drop', 'watch', 'Calcium, phosphorus, vitamin D3 shortage, age, heat, IB and EDS; thin, soft, rough or misshapen shells, fewer eggs.'],
    ['mites-and-lice', 'Mites and lice', 'watch', 'Red mite, northern fowl mite, lice; pale combs, restless birds at night, egg drop, eggs clustered at feather base, mites in perches.'],
    ['internal-worms', 'Internal worms', 'watch', 'Roundworms, caecal worms, tapeworms in free-range and deep-litter birds; poor growth, pale combs, egg drop, worms in droppings.'],
    ['feather-pecking', 'Feather pecking and cannibalism', 'watch', 'Overcrowding, too much light, boredom, protein/salt shortage; feather loss, bleeding vents and backs, birds attacking each other.'],
    ['egg-binding', 'Egg binding and prolapse', 'vet', 'Hen unable to pass egg or vent turned out; straining, penguin stance, tail pumping, red tissue protruding; calcium, oversized eggs, young or fat hens.'],
    ['ascites', 'Ascites (water belly) in broilers', 'vet', 'Heart-lung overload in fast-growing broilers, cold brooding, poor ventilation, altitude; swollen fluid-filled belly, blue comb, panting, sudden deaths.'],
    ['bumblefoot', 'Bumblefoot', 'watch', 'Staphylococcus infection of the foot pad from rough perches and wet litter; swollen foot with black scab, limping.'],
  ]),

  ...group('pigs', [
    ['healthy', 'What a healthy pig looks like', 'normal', 'Baseline: curiosity, temperature 38.5–39.5 °C, curly tail, eating eagerly, normal lying, firm droppings; daily pen check.'],
    ['african-swine-fever', 'African swine fever (ASF)', 'emergency', 'ASF virus; high fever, red-purple skin on ears, belly and legs, huddling, off feed, abortions, sudden high deaths; no vaccine, spreads through pigs, pork, swill and boots.', { report: true, photo: 'pending' }],
    ['foot-and-mouth-disease', 'Foot-and-mouth disease in pigs', 'emergency', 'Picornavirus; blisters on snout, mouth and feet, severe lameness, hooves sloughing, piglet deaths.', R],
    ['erysipelas', 'Swine erysipelas', 'vet', 'Erysipelothrix rhusiopathiae; fever, raised red diamond-shaped skin patches, lameness, sudden death; vaccine available; infects people handling pigs.'],
    ['piglet-scours', 'Piglet scours', 'vet', 'E. coli, clostridia, rotavirus, coccidia in piglets; yellow-white watery diarrhoea, dehydration, deaths; colostrum, warmth, hygiene.'],
    ['pneumonia', 'Pneumonia', 'vet', 'Enzootic pneumonia (Mycoplasma hyopneumoniae) and pasteurellosis; coughing especially on rising, thumping breathing, poor growth; ventilation and stocking.'],
    ['iron-deficiency-anaemia', 'Iron deficiency anaemia in piglets', 'vet', 'Piglets born with little iron, sow milk low in iron; pale skin, fast breathing after exertion, slow growth, scours; iron injection on day 3.'],
    ['mange', 'Mange', 'watch', 'Sarcoptes scabiei var. suis; intense itching, crusts in ears, thick wrinkled skin, rubbing, slow growth.'],
    ['internal-worms', 'Internal worms', 'watch', 'Ascaris suum, whipworm, nodular worm; poor growth, coughing in young pigs, milk spots on liver at slaughter, diarrhoea.'],
    ['cysticercosis', 'Pork tapeworm (cysticercosis)', 'vet', 'Taenia solium cysts in pork from pigs eating human faeces; usually no signs in pigs, cysts in tongue and meat; serious human brain disease. Toilets, confinement, meat inspection, cooking.'],
    ['mma', 'Mastitis-metritis-agalactia (MMA) in sows', 'vet', 'Sow after farrowing: fever, hard hot udder, vaginal discharge, little milk, starving squealing piglets.'],
    ['poor-sow-fertility', 'Poor sow fertility', 'watch', 'Sows not coming on heat, returns to service, small litters; nutrition, body condition, heat stress, boar exposure, disease.'],
    ['heat-stress', 'Heat stress', 'watch', 'Pigs cannot sweat; panting, lying spread out, wallowing in dung, off feed, sow fertility drop, deaths in transport.'],
    ['tail-biting', 'Tail biting', 'watch', 'Stress from overcrowding, boredom, heat, poor feed or water; bitten bleeding tails, infections, abscesses in spine.'],
    ['swine-dysentery', 'Swine dysentery', 'vet', 'Brachyspira hyodysenteriae in growers; grey to bloody mucoid diarrhoea, weight loss, spreads through faeces.'],
    ['mycotoxicosis', 'Mycotoxin poisoning', 'vet', 'Aflatoxin, zearalenone and others in mouldy feed; poor growth, swollen red vulva in gilts, false heat, abortions, liver damage.'],
  ]),

  ...group('rabbits', [
    ['healthy', 'What a healthy rabbit looks like', 'normal', 'Baseline: alert, clean nose and eyes, smooth coat, round dry droppings and soft caecotrophs, eats hay constantly, temperature 38.5–40 °C.'],
    ['coccidiosis', 'Coccidiosis', 'vet', 'Eimeria spp. intestinal and hepatic forms in young rabbits; diarrhoea, pot belly, weight loss, deaths after weaning; hygiene and wire floors.'],
    ['snuffles', 'Snuffles (pasteurellosis)', 'vet', 'Pasteurella multocida; sneezing, thick white nasal discharge, matted front paws from wiping nose, head tilt, abscesses.'],
    ['ear-mites', 'Ear mites (ear canker)', 'watch', 'Psoroptes cuniculi; head shaking, scratching ears, thick brown crusts in ear canal, ear drooping.'],
    ['sore-hocks', 'Sore hocks', 'watch', 'Pressure sores on the heels from wire floors, wet bedding, obesity; hair loss, red then ulcerated heels, reluctance to move.'],
    ['gut-stasis', 'Gut stasis and bloat (enteropathy)', 'emergency', 'Low-fibre diet, stress, mucoid enteropathy in young rabbits; no droppings, hunched, teeth grinding, swollen belly, jelly-like mucus.'],
    ['mastitis', 'Mastitis in does', 'vet', 'Bacterial udder infection after kindling; hot red or blue swollen teats, fever, doe off feed, kits starving.'],
    ['heat-stress', 'Heat stress', 'emergency', 'Rabbits tolerate heat badly; fast breathing, lying stretched out, wet chin, red ears, convulsions, death above ~30 °C.'],
    ['overgrown-teeth', 'Overgrown teeth (malocclusion)', 'vet', 'Teeth not wearing down; drooling, wet chin, dropping food, weight loss, eye discharge; hay and genetics.'],
    ['ringworm', 'Ringworm', 'watch', 'Trichophyton fungus; round crusty hairless patches on head, ears, paws; spreads to people.'],
  ]),

  ...group('fish', [
    ['healthy', 'What healthy fish look like', 'normal', 'Baseline for tilapia and catfish ponds: active schooling, strong feeding response, bright colours, intact fins, clean gills; water quality targets (oxygen, pH, ammonia, temperature).'],
    ['low-oxygen', 'Low oxygen (gasping at the surface)', 'emergency', 'Oxygen crash at dawn after cloudy days, algae die-off, overfeeding, overstocking; fish gulping at surface and inlet, sudden mass deaths.'],
    ['ammonia-poisoning', 'Ammonia and poor water quality', 'vet', 'Overfeeding, high stocking, rotting feed; red or brown gills, lethargy, loss of appetite, fin damage, deaths; water testing and exchange.'],
    ['streptococcosis', 'Streptococcosis', 'vet', 'Streptococcus agalactiae/iniae in tilapia in warm water; pop-eye, cloudy eyes, erratic spinning swimming, swollen belly, deaths.'],
    ['columnaris', 'Columnaris (bacterial gill and skin disease)', 'vet', 'Flavobacterium columnare after handling or stress; white-grey patches on skin, saddle-back lesions, eroded fins and gills.'],
    ['saprolegnia', 'Fungal infection (Saprolegnia)', 'watch', 'Water mould on injured skin and eggs in cool water; cotton-wool tufts on body, fins and eggs.'],
    ['white-spot', 'White spot (Ich)', 'vet', 'Ichthyophthirius multifiliis parasite; small white salt-like spots on skin and fins, flashing/rubbing, gill damage.'],
    ['external-parasites', 'Fish lice and anchor worm', 'watch', 'Argulus and Lernaea parasites; visible lice or thread-like worms on skin, red sores, fish rubbing on pond sides.'],
    ['aeromonas', 'Motile Aeromonas septicaemia (red sore)', 'vet', 'Aeromonas hydrophila after stress or poor water; red blotches and ulcers, swollen belly, fin rot, deaths in catfish and tilapia.'],
  ]),

  ...group('camels', [
    ['healthy', 'What a healthy camel looks like', 'normal', 'Baseline: alert, chewing cud, firm dry droppings, hump condition, temperature range varies with time of day (36–40 °C), herd behaviour.'],
    ['trypanosomiasis', 'Surra (camel trypanosomiasis)', 'vet', 'Trypanosoma evansi spread by biting flies; intermittent fever, weight loss, hump shrinks, anaemia, swelling under belly and legs, abortion; the main camel disease in Kenya.'],
    ['camel-pox', 'Camel pox', 'vet', 'Orthopoxvirus; skin lesions on lips, nostrils, eyelids then body, fever, swollen lymph nodes, worse in calves; can affect people.'],
    ['mange', 'Mange', 'watch', 'Sarcoptes scabiei; intense itching, thick crusted hairless skin starting on head, neck, flanks, inner thighs; spreads to people.'],
    ['skin-necrosis', 'Contagious skin necrosis (abscesses)', 'vet', 'Staphylococcus/Streptococcus infections; skin abscesses and necrotic lesions on neck and shoulders, swollen lymph nodes.'],
    ['mastitis', 'Mastitis', 'vet', 'Bacterial udder infection; swollen hot quarter, abnormal milk, often subclinical; milk hygiene and tick damage to teats.'],
    ['tick-infestation', 'Tick infestation', 'watch', 'Hyalomma and other ticks on udder, perineum, between legs; teat damage, mastitis, anaemia, disease spread.'],
    ['calf-diarrhoea', 'Camel calf diarrhoea', 'vet', 'E. coli, rotavirus, salmonella, poor colostrum; watery diarrhoea, dehydration, deaths in young calves.', { photo: 'pending' }],
  ]),

  ...group('donkeys', [
    ['healthy', 'What a healthy donkey looks like', 'normal', 'Baseline: donkeys hide pain — subtle signs matter; temperature 36.5–37.8 °C, eating, droppings, hoof shape, ear position, body condition.'],
    ['colic', 'Colic', 'emergency', 'Abdominal pain from impaction, gas, sand, sudden diet change, poor teeth, worms; dull, lying down, rolling, pawing, no droppings — donkeys show it quietly.'],
    ['hoof-problems', 'Overgrown hooves and laminitis', 'vet', 'Lack of trimming, soft ground, rich feed; slipper feet, lameness, leaning back to take weight off front feet, heat in the hoof.'],
    ['harness-wounds', 'Harness and saddle wounds', 'vet', 'Badly fitted harness, carts, overloading; open sores on withers, back, chest and tail base; flies and infection.'],
    ['tetanus', 'Tetanus', 'emergency', 'Clostridium tetani via wounds; stiff legs, raised tail, "sawhorse" stance, third eyelid flashing, locked jaw; donkeys very susceptible; vaccination.'],
    ['internal-worms', 'Internal worms', 'watch', 'Strongyles, lungworm, bots; weight loss, rough coat, pot belly, colic, coughing.'],
    ['trypanosomiasis', 'Trypanosomiasis', 'vet', 'Tsetse- and fly-borne trypanosomes; weight loss, weakness, anaemia, swollen legs and belly, intermittent fever.'],
    ['strangles', 'Strangles and respiratory infections', 'vet', 'Streptococcus equi; fever, thick yellow nasal discharge, swollen abscessed lymph nodes under the jaw, cough; very contagious between equines.'],
  ]),
]

/** Pre-existing placeholder images (from the first version of the page) reused here. */
export const LEGACY_IMAGES: Record<string, string> = {
  'cattle/healthy': 'cattle-healthy',
  'cattle/foot-and-mouth-disease': 'cattle-drooling-blisters',
  'cattle/lumpy-skin-disease': 'cattle-skin-lumps',
  'cattle/east-coast-fever': 'cattle-swollen-nodes',
  'cattle/bloat': 'cattle-bloat',
  'cattle/mastitis': 'cattle-mastitis',
  'cattle/anaplasmosis': 'cattle-pale-eyes',
  'cattle/pinkeye': 'cattle-pinkeye',
  'cattle/foot-rot': 'cattle-lameness',
  'cattle/calf-scours': 'cattle-diarrhoea',
  'cattle/internal-worms': 'cattle-poor-condition',
  'cattle/tick-infestation': 'cattle-ticks',
  'goats/healthy': 'goat-healthy',
  'goats/haemonchosis': 'goat-pale-eyelid',
  'goats/ppr': 'goat-ppr',
  'goats/orf': 'goat-orf',
  'goats/ccpp': 'goat-breathing',
  'goats/caseous-lymphadenitis': 'goat-abscess',
  'goats/foot-rot': 'goat-foot-rot',
  'goats/mange': 'goat-mange',
  'poultry/healthy': 'poultry-healthy',
  'poultry/newcastle-disease': 'poultry-twisted-neck',
  'poultry/avian-influenza': 'poultry-swollen-head',
  'poultry/coccidiosis': 'poultry-bloody-droppings',
  'poultry/infectious-coryza': 'poultry-respiratory',
  'poultry/fowl-typhoid': 'poultry-droopy',
  'poultry/fowl-pox': 'poultry-fowl-pox',
  'poultry/mites-and-lice': 'poultry-mites',
  'poultry/leg-weakness': 'poultry-leg-problems',
  'poultry/poor-eggshell-quality': 'poultry-egg-problems',
  'pigs/healthy': 'pig-healthy',
  'pigs/erysipelas': 'pig-diamond-skin',
  'pigs/piglet-scours': 'pig-scours',
  'pigs/pneumonia': 'pig-breathing',
  'pigs/mange': 'pig-mange',
  'pigs/tail-biting': 'pig-tail-biting',
}
