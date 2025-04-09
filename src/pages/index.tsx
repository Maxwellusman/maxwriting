import React from 'react'
import Banner from '../components/Banner';
import CompanyLogosSwiper from '../components/CompanyLogosSwiper';
import Image from 'next/image';
import HomeServices from '../components/HomeServices';
import HomePrices from '../components/HomePrices';
const index = () => {
  return (
    <div>
      <Banner />
      <CompanyLogosSwiper />
      <div className=' grid grid-cols-1 justify-center items-center'>
        <div className='maxwellClass my-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 items-center justify-center'>
            <div className='col-span-2 lg:col-span-1'>
              <h2 className='headingClass'>Rank your Website on Google</h2>
              <p className='textClass'>Is your website lost on Google Search, stopping your business from growing? Don’t worry.
                We at Max Writings® can help your website rank on Google’s top pages. All you need to do is provide a keyword,
                and that’s it; we will make an outline based on search intent. Then, one of our professional
                writers will hand-write an article better than Google’s 1st page results. Of course, the article will pass through
                Grammarly for grammatical mistakes, Hemingway for readability, Originality.AI for AI testing,
                and finally, SEO keywords, internal & external links, and images will be added for SEO-optimization.</p>
              <div className='my-10'>
                <button className='buttonClass'>Create It</button>
              </div>
            </div>
            <div className='col-span-2 lg:col-span-1 flex justify-center items-center'>
              <Image
                src='/images/companylogo1.jpg'
                width={500}
                height={500}
                alt='SEO'
                className="outline-none focus:outline-none"
                draggable={false} // Prevent dragging
                onContextMenu={(e) => e.preventDefault()} // Disables right-click
              />
            </div>
          </div>
        </div>
      </div>
      <div className=' grid grid-cols-1 justify-center items-center'>
        <div className='maxwellClass my-5'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 items-center justify-center'>
            <div className='col-span-2 lg:col-span-1 flex justify-center items-center'>
              <Image
                src='/images/companylogo1.jpg'
                width={500}
                height={500}
                alt='SEO'
                className="outline-none focus:outline-none"
                draggable={false} // Prevent dragging
                onContextMenu={(e) => e.preventDefault()} // Disables right-click
              />
            </div>
            <div className='col-span-2 lg:col-span-1'>
              <h2 className='headingClass'>Get your 1st Article for “Free”</h2>
              <p className='textClass'>We at Max Writing® believe “Well done is better than well said.” — Benjamin Franklin.
                We believe in transparency and want you to test us beforehand without paying anything in advance.
                So, to all our new clients, you can get your first work for Free – whether it’s a blog, product page,
                social media post, or anything else. In fact, you must only hire us if you like our work, otherwise don’t
                even reply back. So, don’t hesitate to contact us; you have nothing to lose.</p>
              <div className='my-10'>
                <button className='buttonClass'>Create It</button>
              </div>
            </div>
   
          </div>
          
        </div>
      </div>
      <HomeServices />
      <div className=' grid grid-cols-1 justify-center items-center'>
        <div className='maxwellClass my-5'>
          <div className='w-full md:w-[80%] lg:w-[70%] mx-auto'>
            <h2 className='headingClass text-center'>Why Choose Us?</h2>
            <p className='textClass'>Max Writings® is a content writing agency that provides high-quality content writing services.
              Long story short, we started back in 2021 and have written more than 7000+ articles,
              including blogs, product pages, social media posts, and pretty much everything else.
              We have covered every industry, such as software, fashion, industrial machinery, car accessories,
              mobiles, protective wear clothing, photography items, capsule homes, rapid prototyping, casting,
              PVD coating, and so on. Last but not least, we don’t ask you to trust our word because we always
              provide 1st article for free as a test. Only hire us if you like our free work.
            </p>
            <div className='my-10 mx-auto text-center'>
              <button className='buttonClass'>Create It</button>
            </div>
          </div>
        </div>
      </div>
      <HomePrices />
    </div>
  )
}

export default index;