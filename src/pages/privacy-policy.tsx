import React from 'react'
import { NextSeo } from 'next-seo';
const privacyPolicy = () => {
  return (
    <>
      <NextSeo
        title="Privacy Policy | MaxWritings - Professional Blog & SEO Content Writing"
        description="Learn more about MaxWritings, your trusted partner for SEO blog writing and content publishing. Discover our mission, vision, and creative process."
        canonical="https://maxwritings.com/privacy-policy"
        openGraph={{
          url: "https://maxwritings.com/privacy-policy",
          title: "Privacy Policy | MaxWritings - Professional Blog & SEO Content Writing",
          description:
            "Learn more about MaxWritings, your trusted partner for SEO blog writing and content publishing.",
          images: [
            {
              url: "https://maxwritings.com/og-image.jpg", // Replace with actual image
              width: 1200,
              height: 630,
              alt: "MaxWritings About Us",
            },
          ],
          siteName: "MaxWritings",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              "About MaxWritings, SEO blog writing, content publishing, professional writers, creative blog writers, content creators",
          },
        ]}
      />

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "MaxWritings",
            url: "https://maxwritings.com",
            logo: "https://maxwritings.com/logo.png", // Replace with actual logo
            sameAs: [
              "https://www.facebook.com/maxwritings",
              "https://twitter.com/maxwritings",
              "https://www.linkedin.com/company/maxwritings",
            ],
            description:
              "MaxWritings is a creative content writing and blog publishing agency that delivers SEO-optimized content to elevate your brand’s online presence.",
          }),
        }}
      />

      <div className="maxwellClass pt-10">
        <div>
          <h1 className="font-raleway text-[20px] text-center mb-5 uppercase tracking-widest">
            Privacy Policy
          </h1>
          <p className="textClass text-center w-full xl:w-[72%] m-auto mt-4">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p className="mb-2">
            We may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Personal Data:</strong> Name, email address, phone number, payment details.</li>
            <li><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent on the site.</li>
            <li><strong>Cookies & Tracking:</strong> We use cookies to enhance user experience (you can disable cookies in your browser settings).</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
          <p className="mb-2">We may use your data for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Providing and improving our services.</li>
            <li>Processing transactions.</li>
            <li>Sending newsletters or updates (you can unsubscribe anytime).</li>
            <li>Analyzing website traffic and user behavior.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Data Sharing & Disclosure</h2>
          <p className="mb-2">We do not sell your personal data. However, we may share information with:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Service Providers:</strong> Payment processors, hosting providers, analytics tools.</li>
            <li><strong>Legal Obligations:</strong> If required by law (e.g., court orders).</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
          <p>We implement security measures to protect your data, but no online transmission is 100% secure.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Third-Party Links</h2>
          <p>Our Website may contain links to third-party sites. We are not responsible for their privacy practices.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access, correct, or delete your data.</li>
            <li>Opt out of marketing communications.</li>
            <li>Request data portability.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Children’s Privacy</h2>
          <p>Our services are not intended for users under <strong>13</strong>. We do not knowingly collect data from children.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy periodically. Check this page for the latest version.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
          <p>For privacy-related questions, contact us at:</p>
          <ul className="list-disc pl-6">
            <li><strong>Email:</strong> maxwritings@gmail.com</li>
            <li><strong>Phone:</strong> +92 313-695-2876</li>
          </ul>
        </section>
      </div>
    </>
  )
}

export default privacyPolicy