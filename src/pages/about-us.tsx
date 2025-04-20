import HowWeWork from "@/components/HowWeWork";
import { NextSeo } from "next-seo";

export default function AboutUs() {
  return (
    <div className="bg-[#f1f1f1]">
      <NextSeo
        title="About Us | MaxWritings - Professional Blog & SEO Content Writing"
        description="Learn more about MaxWritings, your trusted partner for SEO blog writing and content publishing. Discover our mission, vision, and creative process."
        canonical="https://maxwritings.com/about-us"
        openGraph={{
          url: "https://maxwritings.com/about-us",
          title: "About Us | MaxWritings - Professional Blog & SEO Content Writing",
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
          <h2 className="font-raleway text-[20px] text-center mb-5 uppercase tracking-widest font-[600]">
            About Us
          </h2>
          <h2 className="headingClass text-center">
            Professional Blog Writing & Publishing Experts
          </h2>
          <p className="textClass text-center w-full xl:w-[72%] m-auto mt-4 font-[500]">
            At <strong>MaxWritings</strong>, we specialize in crafting SEO-optimized blog posts and
            website content that drives traffic, builds authority, and engages readers. Our team of
            experienced writers and editors works collaboratively to deliver content that aligns
            with your brand voice and digital strategy.
          </p>
          <p className="textClass text-center w-full xl:w-[72%] m-auto mt-4 font-[500]">
            Whether you're a startup, a growing business, or an established brand, we provide
            tailored content writing services that support your marketing goals. From keyword-rich
            blogs to compelling landing pages, we write with search engines and humans in mind.
          </p>
        </div>

        <div className="mt-12">
          <HowWeWork />
        </div>
      </div>
    </div>
  );
}
