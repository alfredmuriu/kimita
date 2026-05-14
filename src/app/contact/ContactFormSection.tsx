'use client';

import { useState } from 'react';

interface ContactFormSectionProps {
  paddingTop?: string;
}

export default function ContactFormSection({ paddingTop = '180px' }: ContactFormSectionProps) {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');

        const form = e.currentTarget;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message }),
        });

        if (res.ok) {
            setStatus('success');
            form.reset();
        } else {
            setStatus('error');
        }
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                .ck-contact-section {
                    background: #ffffff;
                    padding: ${paddingTop} 24px 96px;
                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                }
                .ck-contact-wrap {
                    width: 100%;
                    max-width: 1100px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 56px;
                }
                .ck-contact-intro {
                    display: flex;
                    flex-direction: column;
                    margin-top: 0;
                    align-items: center;
                    text-align: center;
                    flex: 1;
                    max-width: 520px;
                }
                .ck-contact-pretitle {
                    font-size: 14px;
                    font-weight: 500;
                    color: #71717a;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    margin: 0 0 16px;
                }
                .ck-contact-title {
                    font-size: 44px;
                    line-height: 1.15;
                    font-weight: 700;
                    color: #18181b;
                    margin: 0 0 20px;
                }
                .ck-contact-desc {
                    font-size: 16px;
                    line-height: 1.6;
                    color: #71717a;
                    margin: 0;
                }
                .ck-contact-card {
                    width: 100%;
                    max-width: 440px;
                    border: 1px solid #d4d4d8;
                    border-radius: 16px;
                    padding: 24px 28px;
                    background: #ffffff;
                    box-sizing: border-box;
                }
                .ck-contact-card h2 {
                    font-size: 15px;
                    font-weight: 500;
                    color: #27272a;
                    margin: 0 0 14px;
                }
                .ck-form { display: flex; flex-direction: column; gap: 10px; }
                .ck-field { display: flex; flex-direction: column; gap: 4px; }
                .ck-field label {
                    font-size: 12px;
                    color: #a1a1aa;
                    font-weight: 400;
                    margin: 0;
                }
                .ck-field input, .ck-field textarea {
                    background: #fafafa;
                    border: 1px solid #d4d4d8;
                    border-radius: 6px;
                    padding: 5px 12px;
                    font-size: 13px;
                    line-height: 1.4;
                    color: #27272a;
                    outline: none;
                    transition: border-color 0.15s;
                    font-family: inherit;
                    box-sizing: border-box;
                    width: 100%;
                }
                .ck-field input { height: 32px; }
                .ck-field textarea { resize: none; min-height: 60px; }
                .ck-field input::placeholder, .ck-field textarea::placeholder { color: #a1a1aa; }
                .ck-field input:focus, .ck-field textarea:focus {
                    border-color: #71717a;
                    box-shadow: none !important;
                    outline: none !important;
                }
                .ck-submit {
                    margin-top: 6px;
                    align-self: center;
                    text-align: center;
                    cursor: pointer;
                    font-size: 11px !important;
                    padding: 8px 18px !important;
                    height: auto !important;
                    min-height: 0 !important;
                    line-height: 1.4 !important;
                }
                .ck-submit:disabled { opacity: 0.7; cursor: not-allowed; }
                .ck-status { font-size: 13px; margin: 12px 0 0; }
                .ck-status--ok { color: #014d4b; font-weight: 500; }
                .ck-status--err { color: #dc2626; font-weight: 500; }
                @media (min-width: 768px) {
                    .ck-contact-wrap {
                        flex-direction: row;
                        align-items: flex-start;
                        gap: 80px;
                    }
                    .ck-contact-intro {
                        align-items: flex-start;
                        text-align: left;
                    }
                    .ck-contact-title { font-size: 56px; }
                }
                `
            }} />

            <section className="ck-contact-section">
                <div className="ck-contact-wrap">
                    <div className="ck-contact-intro">
                        <p className="ck-contact-pretitle">Get In Touch</p>
                        <h1 className="ck-contact-title">Let&apos;s grow your farm together.</h1>
                        <p className="ck-contact-desc">
                            Talk to our team about natural animal health, supplements and feed solutions
                            built for African farms — and the products that fit your flock or herd.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0 0', fontSize: '15px', lineHeight: 1.9 }}>
                            <li><strong>WhatsApp:</strong> <a href="https://wa.me/254762122122" style={{ color: '#014d4b' }}>+254 762 122 122</a></li>
                            <li><strong>Phone:</strong> <a href="tel:+254202089181" style={{ color: '#014d4b' }}>+254 20 208 9181</a></li>
                            <li><strong>Email:</strong> <a href="mailto:info@agrikima.co.ke" style={{ color: '#014d4b' }}>info@agrikima.co.ke</a></li>
                            <li><strong>Address:</strong> Kibo Street, Industrial Area, Nairobi, Kenya</li>
                        </ul>
                    </div>

                    <div className="ck-contact-card">
                        <h2>Send Message</h2>
                        <form className="ck-form" onSubmit={handleSubmit}>
                            <div className="ck-field">
                                <label htmlFor="name">Name</label>
                                <input id="name" name="name" type="text" placeholder="Enter your name" required />
                            </div>
                            <div className="ck-field">
                                <label htmlFor="email">Email</label>
                                <input id="email" name="email" type="email" placeholder="Enter your email" required />
                            </div>
                            <div className="ck-field">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" placeholder="Your message.." rows={4} required></textarea>
                            </div>
                            <button type="submit" className="btn btn--stroke ck-submit" disabled={status === 'sending'}>
                                {status === 'sending' ? 'Sending...' : 'Send Message'}
                            </button>

                            {status === 'success' && (
                                <p className="ck-status ck-status--ok">
                                    Message sent! We&apos;ll get back to you soon.
                                </p>
                            )}
                            {status === 'error' && (
                                <p className="ck-status ck-status--err">
                                    Something went wrong. Please try again or email us directly.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
