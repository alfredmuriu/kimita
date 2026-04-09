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
                .tw-form-container {
                    padding: ${paddingTop} 20px 80px 20px;
                    background-color: #ffffff;
                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                }
                .tw-form {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-size: 1rem;
                    color: #111827;
                }
                .tw-pretitle {
                    font-size: 2rem;
                    color: #014d4b;
                    font-weight: 600;
                    padding-bottom: 0.5rem;
                    margin: 0;
                }
                .tw-title {
                    font-size: 4rem;
                    font-weight: 700;
                    color: #334155;
                    padding-bottom: 1rem;
                    margin: 0;
                    line-height: 4.5rem;
                }
                .tw-subtitle {
                    font-size: 1.5rem;
                    color: #6b7280;
                    text-align: center;
                    padding-bottom: 2.5rem;
                    margin: 0;
                    line-height: 2.25rem;
                }
                .tw-row {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    width: 100%;
                    max-width: 760px;
                }
                .tw-input-wrapper {
                    width: 100%;
                }
                .tw-label {
                    color: #374151;
                    display: block;
                    font-size: 0.95rem;
                    font-weight: 500;
                    margin-bottom: 0.4rem;
                }
                .tw-input, .tw-textarea {
                    width: 100% !important;
                    border: 1.5px solid #d1d5db !important;
                    border-radius: 0.5rem !important;
                    outline: none !important;
                    padding: 0.75rem 1rem !important;
                    box-sizing: border-box !important;
                    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out !important;
                    background-color: #f9fafb !important;
                    font-size: 1rem !important;
                    color: #111827 !important;
                    font-family: inherit !important;
                }
                .tw-input {
                    height: 52px !important;
                }
                .tw-textarea {
                    height: 160px !important;
                    resize: vertical !important;
                }
                .tw-input:focus, .tw-textarea:focus {
                    border-color: #014d4b !important;
                    box-shadow: 0 0 0 3px rgba(1, 77, 75, 0.1) !important;
                    background-color: #ffffff !important;
                }
                .tw-message-row {
                    margin-top: 1.25rem;
                    width: 100%;
                    max-width: 760px;
                }
                @media (min-width: 768px) {
                    .tw-row {
                        flex-direction: row;
                        gap: 2rem;
                    }
                    .tw-form-container {
                        padding-left: 40px;
                        padding-right: 40px;
                    }
                }
                `
            }} />

            <div className="tw-form-container">
                <form className="tw-form" onSubmit={handleSubmit}>
                    <p className="tw-pretitle">Contact Us</p>
                    <h1 className="tw-title">Get in touch with us</h1>
                    <p className="tw-subtitle">
                        Have questions about our natural poultry solutions or livestock supplements?<br />
                        Reach out to our experts today for personalized farm support.
                    </p>

                    <div className="tw-row">
                        <div className="tw-input-wrapper">
                            <label className="tw-label" htmlFor="name">Your Name</label>
                            <input className="tw-input" id="name" name="name" type="text" required />
                        </div>
                        <div className="tw-input-wrapper">
                            <label className="tw-label" htmlFor="email">Your Email</label>
                            <input className="tw-input" id="email" name="email" type="email" required />
                        </div>
                    </div>

                    <div className="tw-message-row">
                        <label className="tw-label" htmlFor="message">Message</label>
                        <textarea className="tw-textarea" id="message" name="message" required></textarea>
                    </div>

                    <button
                        type="submit"
                        className="btn btn--primary cta-btn"
                        disabled={status === 'sending'}
                        style={{ backgroundColor: '#026c6a', color: '#ffffff', border: 'none', marginTop: '40px', cursor: status === 'sending' ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: status === 'sending' ? 0.7 : 1 }}
                    >
                        {status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}
                    </button>

                    {status === 'success' && (
                        <p style={{ marginTop: '16px', color: '#014d4b', fontWeight: 500 }}>
                            Message sent! We&apos;ll get back to you soon.
                        </p>
                    )}
                    {status === 'error' && (
                        <p style={{ marginTop: '16px', color: '#dc2626', fontWeight: 500 }}>
                            Something went wrong. Please try again or email us directly.
                        </p>
                    )}
                </form>
            </div>
        </>
    );
}
