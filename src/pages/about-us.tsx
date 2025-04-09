import HowWeWork from "@/components/HowWeWork";
import { NextSeo } from "next-seo";

export default function Home() {
  return (
    <div className="bg-[#f1f1f1]">
      <NextSeo
        title="MaxWriting - SEO Content Writing Services"
        description="Get expert SEO-optimized content writing for blogs, websites, and businesses. Improve your search rankings today!"
        canonical="https://maxwriting.org.uk/"
        openGraph={{
          url: "https://maxwriting.org.uk/",
          title: "MaxWriting - SEO Content Writing Services",
          description:
            "Get expert SEO-optimized content writing for blogs, websites, and businesses.",
          images: [
            {
              url: "https://maxwriting.org.uk/og-image.jpg", // Replace with actual OG image
              width: 1200,
              height: 630,
              alt: "MaxWriting SEO Content Services",
            },
          ],
          siteName: "MaxWriting",
        }}
      />
      <div className="maxwellClass pt-10 ">
        <div>
          <h3 className="font-raleway text-[20px] text-center mb-5">ABOUT US</h3>
          <h2 className="headingClass text-center">Creative Blog Writting and <br className="xl:block hidden" /> publishing site</h2>
          <p className="textClass text-center w-full xl:w-[72%] m-auto">Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.</p>
        </div>

        <div>
          <HowWeWork />
        </div>
      </div>
    </div>
  );
}
