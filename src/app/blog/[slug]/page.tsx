import Layout from '@/components/Layout';
import Link from 'next/link';

// Dummy blog post data
const blogPost = {
  title: 'Best Practices for Poultry Disease Prevention in Kenya',
  date: 'January 28, 2025',
  author: 'Agrikima Team',
  image: 'https://images.unsplash.com/photo-1500595046743-cd271d694e30?q=80&w=2000&auto=format&fit=crop',
  content: `
    <h2>Introduction</h2>
    <p>Poultry farming is one of the most rewarding agricultural ventures in Kenya, providing both income and nutrition to millions of families. However, disease outbreaks can devastate flocks and livelihoods in a matter of days. This comprehensive guide covers essential strategies for preventing common poultry diseases.</p>
    
    <h2>Understanding Common Poultry Diseases</h2>
    <p>The most prevalent diseases affecting Kenyan poultry include Newcastle Disease, Infectious Bursal Disease (Gumboro), Coccidiosis, and Fowl Typhoid. Each of these diseases has specific prevention strategies that farmers must understand.</p>
    
    <h3>Newcastle Disease</h3>
    <p>Newcastle Disease is highly contagious and can wipe out an entire flock within days. Symptoms include respiratory distress, greenish diarrhea, and twisted necks. Vaccination is the most effective prevention method.</p>
    
    <h3>Coccidiosis</h3>
    <p>This parasitic disease affects the intestinal tract and is particularly common in young birds. Good litter management and natural preventive supplements can help control this disease.</p>
    
    <h2>Prevention Strategies</h2>
    <h3>1. Biosecurity Measures</h3>
    <p>Implement strict biosecurity protocols including footbaths at entry points, limiting visitors to your poultry house, and quarantining new birds before introducing them to your flock.</p>
    
    <h3>2. Proper Vaccination Schedule</h3>
    <p>Work with a veterinarian to establish a vaccination schedule appropriate for your region. Key vaccines include Newcastle, Gumboro, and Fowl Pox vaccines.</p>
    
    <h3>3. Nutrition and Supplements</h3>
    <p>A well-balanced diet supplemented with vitamins and minerals strengthens the immune system. Natural health solutions can provide additional support for your flock's overall wellbeing.</p>
    
    <h3>4. Clean Water and Feed</h3>
    <p>Ensure birds always have access to clean, fresh water. Contaminated water is a major source of disease transmission. Store feed properly to prevent mold growth.</p>
    
    <h3>5. Proper Housing</h3>
    <p>Good ventilation, appropriate stocking density, and regular cleaning of poultry houses are essential. Poor housing conditions stress birds and make them susceptible to disease.</p>
    
    <h2>Early Detection and Response</h2>
    <p>Monitor your flock daily for signs of illness. Early detection allows for prompt treatment and can prevent disease spread. Key signs to watch for include:</p>
    <ul>
      <li>Reduced feed and water intake</li>
      <li>Decreased egg production</li>
      <li>Unusual droppings</li>
      <li>Respiratory sounds (sneezing, rattling)</li>
      <li>Lethargy or unusual behavior</li>
    </ul>
    
    <h2>Conclusion</h2>
    <p>Prevention is always better than cure. By implementing these strategies consistently, you can significantly reduce disease incidence in your flock and ensure a profitable poultry enterprise. For professional veterinary products and advice, consult with your local agricultural extension officer or visit Agrikima for quality animal health solutions.</p>
  `
};

export default function BlogPost() {
  return (
    <Layout>
      <main>
        <article style={{maxWidth: '800px', margin: '0 auto', padding: '150px 20px 60px'}}>
          {/* Back link */}
          <Link href="/blog" style={{color: '#16a34a', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '30px'}}>
            ← Back to Blog
          </Link>
          
          {/* Featured Image */}
          <img 
            src={blogPost.image}
            alt={blogPost.title}
            style={{width: '100%', height: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '30px'}}
          />
          
          {/* Title and Meta */}
          <h1 style={{fontSize: '36px', fontWeight: '700', color: '#1f2937', marginBottom: '16px', lineHeight: '1.2'}}>
            {blogPost.title}
          </h1>
          <div style={{display: 'flex', gap: '20px', color: '#6b7280', fontSize: '14px', marginBottom: '40px'}}>
            <span>{blogPost.date}</span>
            <span>By {blogPost.author}</span>
          </div>
          
          {/* Content */}
          <div 
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#374151'
            }}
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />
        </article>
      </main>
    </Layout>
  );
}

