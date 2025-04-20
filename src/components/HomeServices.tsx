import Image from 'next/image';

const services = [
  {
    id: 1,
    title: 'SEO Blogs',
    description:
      'Written in a friendly tone, using the second person “You”. These are SEO-optimized to get more views for Google’s ranking – Informational content.',
    image: '/images/SEO.jpg',
  },
  {
    id: 2,
    title: 'Product Pages',
    description:
      'Written in a professional tone with a search intent for sales. To the point and accurate content to turn readers into potential buyers.',
    image: '/images/productpages.jpg',
  },
  {
    id: 3,
    title: 'Home Page',
    description:
      'Written in a friendly + Professional tone to make it feel like personnel but keeping it to the point. Including company history, benefits, product overview, etc.',
    image: '/images/webhomepage.jpg',
  },
  {
    id: 4,
    title: 'Academic Writing',
    description:
      'Whether it is weekly assignments, final year projects, or presentations – we can do all, no matter the field.',
    image: '/images/academicwriting.jpg',
  },
  {
    id: 5,
    title: 'Social Media Posts',
    description:
      'Designing attractive daily posts for Facebook, Instagram, TikTok, Snapchat, Twitter, WeChat, etc.',
    image: '/images/socialmediaposts.jpg',
  },
  {
    id: 6,
    title: 'Website Building',
    description:
      'Build your website from scratch – leave all the hassle on us, from buying hosting to designing layout to writing page text.',
    image: '/images/websitebuilding.jpg',
  },
];

const HomeServices = () => {
  return (
    <div className="maxwellClass">
      <div className="text-center">
        <h2 className="headingClass">Our Services</h2>
        <div className="mb-10">
          {/* <button className="buttonClass">Create It</button> */}
        </div>
      </div>

      {/* Dynamic Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="col-span-3 md:col-span-1 lg:col-span-1">
            <Image
              src={service.image}
              width={500}
              height={500}
              alt={service.title}
              className="outline-none focus:outline-none h-[250px] w-[500px] object-cover rounded-lg mb-5"
              draggable={false} // Prevent dragging
              onContextMenu={(e) => e.preventDefault()} // Disables right-click
              loading='lazy'
            />
            <div>
              <h3 className=" text-[18px] md:text-[24px] text-center text-primary-orange font-[500]">{service.title}</h3>
              <p className='textClass text-center font-[500]'>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeServices;
