'use client';

import Layout from '@/components/Layout';
import ContactFormSection from './ContactFormSection';

export default function ContactForm() {
    return (
        <Layout>
            <style dangerouslySetInnerHTML={{
                __html: `
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
                `
            }} />
            <ContactFormSection paddingTop="180px" />
        </Layout>
    );
}
