'use client';

import { useState } from 'react';

export default function ArticleContactForm() {
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
        <section className="article-contact">
            <style dangerouslySetInnerHTML={{ __html: `
                .article-contact {
                    margin: 56px auto 0;
                    max-width: 440px;
                    padding: 24px 28px;
                    border: 1px solid #d4d4d8;
                    border-radius: 16px;
                    background: #ffffff;
                    box-sizing: border-box;
                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                }
                .article-contact h3 {
                    font-size: 15px;
                    font-weight: 500;
                    color: #27272a;
                    margin: 0 0 14px;
                }
                .article-contact form { display: flex; flex-direction: column; gap: 10px; }
                .article-contact .field { display: flex; flex-direction: column; gap: 4px; }
                .article-contact label {
                    font-size: 12px;
                    color: #a1a1aa;
                    font-weight: 400;
                    margin: 0;
                }
                .article-contact input, .article-contact textarea {
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
                .article-contact input { height: 32px; }
                .article-contact textarea { resize: none; min-height: 60px; }
                .article-contact input:focus, .article-contact textarea:focus {
                    border-color: #71717a;
                    box-shadow: none !important;
                    outline: none !important;
                }
                .article-contact .submit {
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
                .article-contact .submit:disabled { opacity: 0.7; cursor: not-allowed; }
                .article-contact .status { font-size: 13px; margin: 8px 0 0; text-align: center; }
                .article-contact .status--ok { color: #014d4b; font-weight: 500; }
                .article-contact .status--err { color: #dc2626; font-weight: 500; }
            ` }} />

            <h3>Your message to the team</h3>
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label htmlFor="ac-name">Name</label>
                    <input id="ac-name" name="name" type="text" placeholder="Enter your name" required />
                </div>
                <div className="field">
                    <label htmlFor="ac-email">Email</label>
                    <input id="ac-email" name="email" type="email" placeholder="Enter your email" required />
                </div>
                <div className="field">
                    <label htmlFor="ac-message">Message</label>
                    <textarea id="ac-message" name="message" placeholder="Your message.." rows={4} required></textarea>
                </div>
                <button type="submit" className="btn btn--stroke submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>

                {status === 'success' && (
                    <p className="status status--ok">Message sent! We&apos;ll get back to you soon.</p>
                )}
                {status === 'error' && (
                    <p className="status status--err">Something went wrong. Please try again or email us directly.</p>
                )}
            </form>
        </section>
    );
}
