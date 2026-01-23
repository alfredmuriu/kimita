'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Why are my chickens dying suddenly? Common causes of poultry mortality in Kenya",
    answer: "Sudden chicken deaths in Kenya are often caused by Newcastle disease (the #1 killer), Gumboro (IBD), infectious bronchitis, or coccidiosis. Other causes include heat stress, poor ventilation, contaminated water, and vitamin deficiencies.\n Prevention is key — use ADVICE for natural viral protection, maintain proper vaccination schedules, and give AGRIVITAM during stress periods. If you're losing birds rapidly, isolate sick chickens immediately and contact a veterinarian.",
  },
  {
    question: "How do I start poultry farming in Kenya? Beginner's guide for new farmers",
    answer: "To start poultry farming in Kenya: \n1) Choose between broilers (meat, 6-8 weeks) or layers (eggs, 18 months+). \n2) Start small with 10-50 birds. \n3) Build a proper chicken house with good ventilation. \n4) Source quality day-old chicks from certified hatcheries. \n5) Follow a proper broiler or layer vaccination schedule. \n6) Use quality feeds supplemented with vitamins like AGRIVITAM. \n7) Prevent diseases early with natural immunity boosters like ADVICE. \nContact Agrikima for a free starter consultation.",
  },
  {
    question: "How do I treat coccidiosis in chickens naturally without antibiotics?",
    answer: "Coccidiosis causes bloody diarrhea, weakness, and death in chickens. For natural treatment: \n1) Use BIO-GAR — our garlic-based gut health supplement that helps control coccidiosis naturally. \n2) Improve litter management and keep bedding dry. \n3) Boost immunity with ADVICE. \n4) Add apple cider vinegar to drinking water. \nWhile severe cases may need anticoccidial medication, natural prevention with BIO-GAR reduces outbreaks significantly. Always maintain clean, dry housing to prevent coccidia buildup.",
  },
  {
    question: "What is the best broiler vaccination schedule in Kenya?",
    answer: "Recommended broiler vaccination schedule in Kenya: \nDay 1: Marek's disease (at hatchery). \nDay 7: Newcastle (Lasota) + Gumboro (IBD). \nDay 14: Gumboro booster. \nDay 21: Newcastle booster. \nBetween vaccinations, use ADVICE to boost natural immunity and reduce post-vaccination stress. \nGive AGRIVITAM in drinking water during vaccination days to improve vaccine response. \nThis schedule protects against the most common poultry diseases that cause sudden death in broilers.",
  },
  {
    question: "How do I increase egg production in layer chickens?",
    answer: "To maximize layer egg production: \n1) Provide 16 hours of light daily. \n2) Use quality layer feeds with adequate calcium (add DCP 18 for strong eggshells). \n3) Supplement with AGRIVITAM to prevent vitamin deficiencies that reduce laying. \n4) Keep stress low — avoid sudden changes in feed, lighting, or environment. \n5) Prevent diseases like Newcastle with ADVICE. \n6) Maintain proper water intake. \nLayers at peak production need 120-150g feed daily. \nWeak eggshells? Add calcium supplements to your feeding program.",
  },
  {
    question: "What causes diarrhea in chickens and how do I stop it?",
    answer: "Chicken diarrhea causes include coccidiosis (bloody droppings), Newcastle disease (greenish droppings), bacterial infections, poor water quality, or feed issues. \nTreatment: \n1) Identify the cause — bloody diarrhea often means coccidiosis, treat with BIO-GAR naturally. \n2) Provide electrolytes and AGRIVITAM to prevent dehydration. \n3) Improve hygiene and water quality. \n4) For persistent diarrhea, consult a vet. Prevention is better — use BIO-GAR regularly for gut health and ADVICE for viral disease protection.",
  },
  {
    question: "How do I prevent Newcastle disease in my poultry farm?",
    answer: "Newcastle disease prevention requires: \n1) Strict vaccination — follow the recommended schedule with Lasota or I-2 vaccines. \n2) Biosecurity — limit farm visitors, change shoes/clothes before entering. \n3) Natural immunity support — use ADVICE between vaccinations to boost viral resistance. \n4) Quarantine new birds for 2 weeks. \n5) Proper disposal of dead birds. \nSymptoms include twisted necks, gasping, greenish diarrhea, and sudden death. Unvaccinated flocks can lose 100% of birds. ADVICE provides natural support alongside vaccination.",
  },
  {
    question: "What vitamins do chickens need? Signs of vitamin deficiency in poultry",
    answer: "Chickens need vitamins A, D3, E, K, and B-complex. \nDeficiency signs: \nVitamin A — eye problems, weakness. \nVitamin D3 — soft bones, thin eggshells. \nVitamin E — crazy chick disease, fertility issues. \nVitamin K — blood clotting problems. \nB vitamins — poor growth, curled toes. \nAGRIVITAM provides all essential poultry vitamins in one supplement. Give during stress, after vaccination, disease recovery, or whenever you notice poor feathering, low egg production, or weak chicks.",
  },
];


export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="s-faq target-section">
      <div className="row section-header">
        <h3 className="column lg-12 section-header__pretitle text-pretitle">Frequently Asked Questions</h3>
        <div className="column lg-6 stack-on-1100 section-header__primary">
          <h2 className="title text-display-1">
            Common Poultry Health Problems &amp; Solutions.
          </h2>
        </div>
        <div className="column lg-6 stack-on-1100 section-header__secondary">
          <p className="desc">
            Get expert answers to your questions about chicken diseases, poultry vaccination, broiler management,
            layer farming, and natural animal health solutions. From preventing Newcastle disease to boosting egg production —
            we&apos;ve got you covered.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="column lg-12">
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${openIndex === index ? 'faq-item--open' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-item__header">
                  <h4 className="faq-item__question">{faq.question}</h4>
                  <div className="faq-item__icon">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`faq-icon ${openIndex === index ? 'faq-icon--rotated' : ''}`}
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className={`faq-item__answer ${openIndex === index ? 'faq-item__answer--visible' : ''}`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

