import React from 'react'
import { NextSeo } from 'next-seo';
const privacyPolicy = () => {
  return (
    <>
      <NextSeo
        title="Terms & Conditions | MaxWritings - Professional Blog & SEO Content Writing"
        description="Learn more about MaxWritings, your trusted partner for SEO blog writing and content publishing. Discover our mission, vision, and creative process."
        canonical="https://maxwritings.com/pterms-and-conditions"
        openGraph={{
          url: "https://maxwritings.com/pterms-and-conditions",
          title: "Terms & Conditions | MaxWritings - Professional Blog & SEO Content Writing",
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
            Terms and Conditions
          </h1>
          <p className="textClass text-center w-full xl:w-[72%] m-auto mt-4">
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Use of the Website</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>You must be at least <strong>18</strong> or have parental consent.</li>
            <li>You agree not to misuse the Website (e.g., hacking, spamming).</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Intellectual Property</h2>
          <p>All content (text, images, logos) is owned by <strong>MaxWritings.com</strong> and protected by copyright laws.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. User-Generated Content</h2>
          <p>If you submit content (comments, reviews), you grant us a license to use it. Do not post illegal or offensive material.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Disclaimers</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>The Website is provided "as is" without warranties.</li>
            <li>We are not liable for any damages from your use of the site.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
          <p><strong>MaxWritings.com</strong> is not responsible for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Errors or interruptions in service.</li>
            <li>Third-party actions or content.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Governing Law</h2>
          <p>These Terms are governed by international laws applicable to digital services.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
          <p>We may update these Terms. Continued use constitutes acceptance.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
          <p>For questions, contact:</p>
          <ul className="list-disc pl-6">
            <li><strong>Email:</strong> maxwritings@gmail.com</li>
            <li><strong>Phone:</strong> +92 313-695-2876</li>
          </ul>
        </section>
      </div>
    </>
  )
}

export default privacyPolicy;