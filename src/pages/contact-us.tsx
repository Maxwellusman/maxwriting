import React from "react";
import ContactForm from "../components/ContactForm";
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin, } from "lucide-react";
import Link from "next/link";
import { NextSeo } from "next-seo";

const ContactUs = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 lg:mt-32 pb-10">
      <NextSeo
        title="Contact Us | MaxWritings - Let's Work Together"
        description="Have questions or want to discuss a content writing project? Contact MaxWritings today via email, phone, or our online contact form."
        canonical="https://maxwritings.com/contact-us"
        openGraph={{
          url: "https://maxwritings.com/contact-us",
          title: "Contact MaxWritings - Reach Out Today",
          description:
            "Have questions or want to discuss a content writing project? Contact MaxWritings today via email, phone, or our online contact form.",
          images: [
            {
              url: "https://maxwritings.com/og-contact.jpg", // Replace with actual image
              width: 1200,
              height: 630,
              alt: "Contact MaxWritings",
            },
          ],
          siteName: "MaxWritings",
        }}
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact MaxWritings",
            description:
              "Get in touch with MaxWritings for SEO content writing, blog publishing, and business inquiries.",
            url: "https://maxwritings.com/contact-us",
            mainEntity: {
              "@type": "Organization",
              name: "MaxWritings",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+92-313-695-2876",
                contactType: "Customer Service",
                email: "maxwritings@gmail.com",
              },
            },
          }),
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Section - Contact Info */}
        <div>
          <h1 className="text-3xl font-bold text-center lg:text-left leading-tight">
            Contact Us
          </h1>
          <p className="text-center lg:text-left text-gray-600 mt-2">
            Have questions or want to start your content journey? Reach out to MaxWritings — we're here to help.
          </p>

          <div className="mt-6 space-y-4">
            {/* Phone */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <Phone size={24} className="text-primary-orange" />
              <Link href="tel:+923136952876" className="text-gray-800 hover:text-blue-600 transition">
                +92 313-695-2876
              </Link>
            </div>

            {/* Email */}
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <Mail size={24} className="text-primary-orange" />
              <Link href="mailto:maxwritings@gmail.com" className="text-gray-800 hover:text-blue-600 transition">
                maxwritings@gmail.com
              </Link>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center lg:justify-start gap-5 mt-5">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook size={28} className="text-gray-600 hover:text-blue-600 transition-all cursor-pointer" />
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter size={28} className="text-gray-600 hover:text-blue-500 transition-all cursor-pointer" />
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram size={28} className="text-gray-600 hover:text-pink-600 transition-all cursor-pointer" />
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin size={28} className="text-gray-600 hover:text-blue-800 transition-all cursor-pointer" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
