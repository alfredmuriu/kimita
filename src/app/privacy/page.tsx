import { Metadata } from 'next';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'Privacy Policy — Agrikima',
  description:
    'How Agrikima collects, uses and protects information from website visitors and customers who contact us via WhatsApp, email or phone.',
  alternates: {
    canonical: 'https://www.agrikima.co.ke/privacy',
  },
};

const LAST_UPDATED = '1 May 2026';

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <style dangerouslySetInnerHTML={{ __html: `
        body, .s-header, .s-header__inner, .s-header__nav, .s-header__menu-links, .s-header__social, #page, .s-pagewrap, .s-content, main {
            background-color: #ffffff !important;
            color: #111111 !important;
        }
        .s-header__menu-links a, .email { color: #111111 !important; }
        .s-header__menu-links li.current > a { color: #014d4b !important; }
        .s-header__social svg path { fill: #111111 !important; }
        .s-header__menu-toggle span, .s-header__menu-toggle span::before, .s-header__menu-toggle span::after { background-color: #111111 !important; }
      `}} />

      <main style={{ maxWidth: 820, margin: '0 auto', padding: '80px 24px 120px', lineHeight: 1.7, color: '#111' }}>
        <h1 style={{ fontSize: 38, marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: '#666', marginBottom: 32 }}>Last updated: {LAST_UPDATED}</p>

        <p>
          Agrikima Africa Ltd (&quot;Agrikima&quot;, &quot;we&quot;, &quot;us&quot;) provides natural animal
          health and crop management products across Kenya, Uganda, Rwanda and Tanzania.
          This policy explains what information we collect when you visit{' '}
          <a href="https://www.agrikima.co.ke">www.agrikima.co.ke</a> or contact us via
          WhatsApp, email or phone, and how we use and protect that information.
        </p>

        <h2 style={{ fontSize: 24, marginTop: 40 }}>1. Information we collect</h2>
        <ul>
          <li>
            <strong>Contact details</strong> you give us when you message our WhatsApp number,
            email <a href="mailto:info@agrikima.co.ke">info@agrikima.co.ke</a>, or fill in a
            form on our site (name, phone number, email, location, the question or order you
            sent us).
          </li>
          <li>
            <strong>WhatsApp conversation history</strong> when you chat with our automated
            assistant or staff, so we can answer follow-up questions in context and improve
            our responses.
          </li>
          <li>
            <strong>Basic usage data</strong> from our website (pages viewed, approximate
            location, device type) collected through Google Analytics and Vercel Analytics.
          </li>
        </ul>

        <h2 style={{ fontSize: 24, marginTop: 40 }}>2. How we use your information</h2>
        <ul>
          <li>To answer your product questions and process orders.</li>
          <li>
            To provide and improve our automated WhatsApp assistant, including reviewing
            conversations to fix mistakes and add missing information.
          </li>
          <li>To send you updates you have asked for (e.g. blog posts, training videos).</li>
          <li>To understand how visitors use our website so we can improve it.</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>

        <h2 style={{ fontSize: 24, marginTop: 40 }}>3. WhatsApp messaging</h2>
        <p>
          When you message our WhatsApp Business number, your messages are delivered to us
          through Meta&apos;s WhatsApp Business Platform. Meta&apos;s handling of your data on the
          WhatsApp service is governed by{' '}
          <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
            WhatsApp&apos;s Privacy Policy
          </a>
          . On our side, we store your phone number, name (if shared) and the conversation in
          a secure database so we can serve you. You can ask us to delete this record at any
          time.
        </p>

        <h2 style={{ fontSize: 24, marginTop: 40 }}>4. Sharing with service providers</h2>
        <p>We share data only with vendors that help us run the service:</p>
        <ul>
          <li><strong>Meta / WhatsApp</strong> — to deliver and receive WhatsApp messages.</li>
          <li><strong>Vercel</strong> — to host the website and the WhatsApp webhook.</li>
          <li><strong>Supabase</strong> — to store conversations and form submissions.</li>
          <li><strong>OpenAI</strong> — to generate replies in our automated assistant. Conversations are sent to OpenAI for processing but are not used to train their models.</li>
          <li><strong>Brevo</strong> — to send transactional and notification emails.</li>
          <li><strong>Google Analytics</strong> — to measure website usage.</li>
        </ul>

        <h2 style={{ fontSize: 24, marginTop: 40 }}>5. How long we keep your data</h2>
        <p>
          We keep WhatsApp conversation history and form submissions for as long as needed to
          provide the service and meet legal or accounting obligations. You can ask us to
          delete your record sooner — contact details are below.
        </p>

        <h2 style={{ fontSize: 24, marginTop: 40 }}>6. Your rights</h2>
        <p>You can ask us to:</p>
        <ul>
          <li>Show you what information we hold about you.</li>
          <li>Correct information that is wrong.</li>
          <li>Delete your information.</li>
          <li>Stop sending you marketing messages.</li>
        </ul>
        <p>
          To exercise any of these rights, email{' '}
          <a href="mailto:info@agrikima.co.ke">info@agrikima.co.ke</a> or message our WhatsApp
          number.
        </p>

        <h2 style={{ fontSize: 24, marginTop: 40 }}>7. Security</h2>
        <p>
          We use reputable providers (Vercel, Supabase, Meta) and standard security practices
          such as encrypted connections (HTTPS) and access controls. No system is perfectly
          secure — please don&apos;t send us sensitive financial or health information through
          WhatsApp or email.
        </p>

        <h2 style={{ fontSize: 24, marginTop: 40 }}>8. Children</h2>
        <p>
          Our services are intended for farmers, distributors and adult customers. We do not
          knowingly collect data from children under 18.
        </p>

        <h2 style={{ fontSize: 24, marginTop: 40 }}>9. Changes to this policy</h2>
        <p>
          We may update this policy from time to time. The &quot;Last updated&quot; date at the top of
          this page tells you when it last changed. Significant changes will be highlighted
          on our website.
        </p>

        <h2 style={{ fontSize: 24, marginTop: 40 }}>10. Contact us</h2>
        <p>
          Agrikima Africa Ltd<br />
          Kibo Street, Off Road A, Industrial Area<br />
          P.O. Box 7773-00200, Nairobi, Kenya<br />
          Email: <a href="mailto:info@agrikima.co.ke">info@agrikima.co.ke</a><br />
          Phone / WhatsApp: +254 762 122 122
        </p>
      </main>
    </Layout>
  );
}
