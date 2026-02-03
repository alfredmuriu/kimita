'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Why are my poultry dying suddenly? Common causes of poultry mortality",
    answer: "Sudden chicken deaths are often caused by Newcastle disease (the #1 killer), Gumboro (IBD), infectious bronchitis, or coccidiosis. Other causes include heat stress, poor ventilation, contaminated water, and vitamin deficiencies.\n If you're losing flock rapidly, isolate sick birds immediately and contact a veterinarian.",
  },
  {
    question: "How do I start poultry farming? Beginner's guide for new farmers",
    answer: "1) Choose between broilers (meat, 6-8 weeks) or layers (eggs, 18 months+). \n2) Build a proper poultry house with good ventilation. \n3) Source quality day-old chicks from certified hatcheries. \n4) Follow a proper broiler or layer vaccination schedule.",
  },
  {
    question: "How do I treat coccidiosis naturally without antibiotics?",
    answer: "Coccidiosis causes bloody diarrhea, weakness, and death in chickens. For natural treatment: \n1) Use BIO-GAR — our garlic-based gut health supplement that helps control coccidiosis naturally. \n2) Improve litter management and keep bedding dry. \n3) Boost immunity with ADVICE. \nWhile severe cases may need anticoccidial medication, natural prevention with BIO-GAR reduces outbreaks significantly. Always maintain clean, dry housing to prevent coccidia buildup.",
  },
  {
    question: "What is a recommended poultry vaccination schedule?",
    answer: "Recommended poultry vaccination schedule: \nDay 1: Marek's disease (at hatchery). \nDay 7: Newcastle (Lasota) + Gumboro (IBD). \nDay 14: Gumboro booster. \nDay 21: Newcastle booster.",
  },
  {
    question: "How do I increase egg production in layer chickens?",
    answer: "To maximize layer egg production: \n1) Provide 16 hours of light daily. \n2) Use quality layer feeds with adequate calcium. \n3) Keep stress low — avoid sudden changes in feed, lighting, or environment. \n4) Prevent diseases like Newcastle. \n5) Maintain proper water intake. \nLayers at peak production need 120-150g feed daily.",
  },
  {
    question: "What causes diarrhea in poultry and how do I stop it?",
    answer: "Common diarrhea causes include coccidiosis (bloody droppings), Newcastle disease (greenish droppings), bacterial infections, poor water quality, or feed issues. \nTreatment: \n1) Identify the cause — bloody diarrhea often means coccidiosis, treat with BIO-GAR naturally. \n2) Provide electrolytes to prevent dehydration. \n3) Improve hygiene and water quality. \n4) For persistent diarrhea, consult a veterinarian.",
  },
  {
    question: "How do I prevent Newcastle disease in my poultry farm?",
    answer: "Newcastle disease prevention requires: \n1) Strict vaccination — follow the recommended schedule with Lasota or I-2 vaccines. \n2) Biosecurity — limit farm visitors, change shoes/clothes before entering. \n3) Natural immunity support — use ADVICE between vaccinations to boost viral resistance. \n4) Quarantine new birds for 2 weeks. \n5) Proper disposal of dead birds. \nSymptoms include twisted necks, gasping, greenish diarrhea, and sudden death. \nUnvaccinated flocks can lose 100% of birds.",
  },
  {
    question: "What vitamins do chickens need? Signs of vitamin deficiency in poultry",
    answer: "Chickens need vitamins A, D3, E, K, and B-complex. \nDeficiency signs: \nVitamin A — eye problems, weakness. \nVitamin D3 — soft bones, thin eggshells. \nVitamin E — crazy chick disease, fertility issues. \nVitamin K — blood clotting problems. \nB vitamins — poor growth, curled toes.",
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

