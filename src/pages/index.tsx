import React from 'react'
import Head from 'next/head';
import Banner from '../components/Banner';
import CompanyLogosSwiper from '../components/CompanyLogosSwiper';
import Image from 'next/image';
import HomeServices from '../components/HomeServices';
import HomePrices from '../components/HomePrices';
import WhyChooseImages from '@/components/WhyChooseImages';

const Home = () => {
  const pageTitle = "Max Writings® | Professional SEO Content Writing Services";
  const pageDescription = "Get hand-written, SEO-optimized content that ranks on Google's first page. Try our services with your first article free! 7000+ articles written since 2021.";
  const canonicalUrl = "https://maxwritings.com/";
  const keywords = "SEO content writing, blog writing service, Google ranking, professional writers, SEO optimization, content marketing";

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content="/images/content1.jpg" />

        {/* Twitter */}
        <meta property="twitter:url" content={canonicalUrl} />
        <meta property="twitter:title" content={pageTitle} />
        <meta property="twitter:description" content={pageDescription} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "Max Writings®",
            "image": "/images/content1.jpg",
            "description": pageDescription,
            "url": canonicalUrl,
            "telephone": "+923136952876",
            "priceRange": "$$",
          })}
        </script>
      </Head>

      <main>
        <Banner />
        {/* <CompanyLogosSwiper /> */}

        {/* Section 1: Rank on Google */}
        <section className='grid grid-cols-1 justify-center items-center mt-5' itemScope itemType="https://schema.org/Service">
          <div className='maxwellClass my-5'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 items-center justify-center'>
              <div className='col-span-2 lg:col-span-1'>
                <h2 className='headingClass' itemProp="name">Rank Your Website on Google's First Page</h2>
                <p className='textClass font-[500]' itemProp="description">
                  Is your website lost on Google Search, stopping your business from growing? Don't worry.
                  We at Max Writings® can help your website rank on Google's top pages. All you need to do is provide a keyword,
                  and that's it; we will make an outline based on search intent. Then, one of our professional
                  writers will hand-write an article better than Google's 1st page results. Of course, the article will pass through
                  Grammarly for grammatical mistakes, Hemingway for readability, Originality.AI for AI testing,
                  and finally, SEO keywords, internal & external links, and images will be added for SEO-optimization.
                </p>
                <div className='my-10'>
                  <a href="/order" className='buttonClass' aria-label="Order SEO content writing services">
                    Create It Now
                  </a>
                </div>
              </div>
              <div className='col-span-2 lg:col-span-1 flex justify-center items-center'>
                <Image
                  src='/images/Rank on GOOGLE First page.png'
                  width={500}
                  height={500}
                  alt='Professional SEO content writing service to rank on Google'
                  className="outline-none focus:outline-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  priority // Important for LCP image
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Free Article */}
        <section className='grid grid-cols-1 justify-center items-center'>
          <div className='maxwellClass my-5'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 items-center justify-between'>
              <div className='col-span-2 lg:col-span-1 flex justify-center items-start'>
                <Image
                  src='/images/Free Blog Sample.png'
                  width={500}
                  height={500}
                  alt='Try our content writing services with a free article'
                  className="outline-none focus:outline-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
              <div className='col-span-2 lg:col-span-1'>
                <h2 className='headingClass'>Get Your First SEO-Optimized Article for Free</h2>
                <p className='textClass font-[500]'>
                  We at Max Writing® believe "Well done is better than well said." — Benjamin Franklin.
                  We believe in transparency and want you to test our premium content writing services without paying anything in advance.
                  So, to all our new clients, you can get your first work for Free – whether it's a blog, product page,
                  social media post, or anything else. In fact, you must only hire us if you like our work, otherwise don't
                  even reply back. So, don't hesitate to contact us; you have nothing to lose.
                </p>
                <div className='my-10'>
                  <a href="/free-article" className='buttonClass' aria-label="Get your free SEO article">
                    Claim Free Article
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HomeServices />

        {/* Section 3: Why Choose Us */}
        <section className='grid grid-cols-1 justify-center items-center'>
          <div className='maxwellClass mt-5'>
            <div className='w-full md:w-[80%] lg:w-[70%] mx-auto'>
              <h2 className='headingClass text-center'>Why Choose Our SEO Content Writing Services?</h2>
              <WhyChooseImages />
              <p className='textClass font-[500]'>
                
                Long story short, we started back in 2021 and have written more than 7000+ articles, including blogs, product pages, social media posts, and pretty much everything else. We have covered every industry, such as software, fashion, industrial machinery, car accessories, mobiles, protective wear clothing, photography items, capsule homes, rapid prototyping, casting, PVD coating, and so on. Last but not least, we don't ask you to trust our word because we always provide 1st article for free as a test. Only hire us if you like our free work.
              </p>

              {/* <div className='my-10 mx-auto text-center '>
                <a href="/contact" className='buttonClass' aria-label="Contact our SEO content writing team">
                  Start Ranking Today
                </a>
              </div> */}
            </div>
          </div>
        </section>

        <section>
          <div className='maxwellClass mt-5'>
            <div className='w-full md:w-[80%] lg:w-[70%] mx-auto'>
              <h2 className='headingClass text-center'>Our Clients</h2>
            </div>
          </div>
          <CompanyLogosSwiper />
        </section>

        <HomePrices />
      </main>
    </>
  )
}

export default Home;