'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

export default function Contact() {
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
        <Layout>
            <style dangerouslySetInnerHTML={{
                __html: `
                /* Header White Theme Overrides */
                body, .s-header, .s-header__inner, .s-header__nav, .s-header__menu-links, .s-header__social, .dropdown-menu {
                    background-color: #ffffff !important;
                }
                .s-header__menu-links a, .s-header__social .email {
                    color: #111111 !important;
                }
                .s-header__menu-links li.current > a {
                    color: #014d4b !important;
                }
                
        .s-header__social svg path {
            fill: #111111 !important;
        }
        .s-header__menu-links > .dropdown > .dropdown-menu {
            background-color: #ffffff !important;
        }
        .s-header__menu-links > .dropdown > .dropdown-menu a {
            color: #111111 !important;
        }
        .s-header__menu-links > .dropdown > .dropdown-menu a:hover {
            color: #014d4b !important;
        }

                /* Emulated Tailwind Styles for Contact Form */
                .tw-form-container {
                    padding: 180px 20px 80px 20px; /* Increased top padding to clear the fixed header */
                    background-color: #ffffff;
                    min-height: 60vh;
                    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                }

                .tw-form {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    font-size: 0.875rem; /* text-sm */
                    color: #111827;
                }

                .tw-pretitle {
                    font-size: 2rem; /* significantly larger */
                    color: #014d4b; /* Agrikima green */
                    font-weight: 600; /* bolder */
                    padding-bottom: 0.5rem;
                    margin: 0;
                }

                .tw-title {
                    font-size: 4rem; /* significantly larger */
                    font-weight: 700;
                    color: #334155;
                    padding-bottom: 1rem;
                    margin: 0;
                    line-height: 4.5rem;
                }

                .tw-subtitle {
                    font-size: 1.5rem; /* significantly larger */
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
                    gap: 1.5rem; /* reduced gap */
                    width: 350px; /* restored original mobile width */
                }

                .tw-input-wrapper {
                    width: 100%; /* w-full */
                }

                .tw-label {
                    color: rgba(0, 0, 0, 0.7); /* text-black/70 */
                    display: block;
                }

                .tw-input, .tw-textarea {
                    width: 100% !important;
                    border: 1px solid rgba(107, 114, 128, 0.3) !important;
                    border-radius: 0.25rem !important;
                    outline: none !important;
                    margin-top: 0.35rem !important;
                    padding: 0.5rem 0.75rem !important;
                    box-sizing: border-box !important;
                    transition: border-color 0.15s ease-in-out !important;
                    background-color: #ffffff !important;
                    font-size: 0.9rem !important;
                    color: #111827 !important;
                }

                .tw-input {
                    height: 44px !important;
                }

                .tw-textarea {
                    height: 130px !important;
                    resize: vertical !important;
                }

                .tw-input:focus, .tw-textarea:focus {
                    border-color: #a5b4fc; /* focus:border-indigo-300 */
                }

                .tw-message-row {
                    margin-top: 1.25rem; /* tighter spacing */
                    width: 350px; /* restored original mobile width */
                }

                .tw-button {
                    margin-top: 1.25rem; /* mt-5 */
                    background-color: #4f46e5; /* bg-indigo-600 */
                    color: #ffffff; /* text-white */
                    height: 3rem; /* h-12 */
                    width: 14rem; /* w-56 */
                    padding-left: 1rem; /* px-4 */
                    padding-right: 1rem;
                    border-radius: 0.25rem; /* rounded */
                    border: none;
                    cursor: pointer;
                    transition: transform 0.1s; /* transition */
                    font-size: 1rem;
                }

                .tw-button:active {
                    transform: scale(0.95); /* active:scale-95 */
                }

                @media (min-width: 768px) {
                    .tw-row {
                        flex-direction: row; /* md:flex-row */
                        width: 700px; /* restored original desktop width */
                        gap: 2rem; /* restored original gap */
                    }
                    .tw-message-row {
                        width: 700px; /* restored original desktop width */
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
        </Layout>
    );
}
