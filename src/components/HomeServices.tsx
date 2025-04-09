import Image from 'next/image';

const services = [
  {
    id: 1,
    title: 'SEO Blogs',
    description:
      'Written in a friendly tone, using the second person “You”. These are SEO-optimized to get more views for Google’s ranking – Informational content.',
    image: '/images/companylogo1.jpg',
  },
  {
    id: 2,
    title: 'Content Writing',
    description:
      'High-quality content writing services for websites, blogs, and marketing materials. Well-researched and engaging content.',
    image: '/images/companylogo2.png',
  },
  {
    id: 3,
    title: 'Social Media Marketing',
    description:
      'We help businesses build a strong online presence and engage audiences through strategic social media marketing.',
    image: '/images/companylogo3.jpg',
  },
  {
    id: 4,
    title: 'Web Development',
    description:
      'From simple websites to complex web applications, our team provides customized solutions to meet your business needs.',
    image: '/images/companylogo1.jpg',
  },
  {
    id: 5,
    title: 'Graphic Design',
    description:
      'Creative and eye-catching designs for branding, social media, and marketing materials to boost your business.',
    image: '/images/companylogo2.png',
  },
  {
    id: 6,
    title: 'Google Ads',
    description:
      'We create and optimize Google Ads campaigns to drive targeted traffic and maximize your return on investment.',
    image: '/images/companylogo3.jpg',
  },
];

const HomeServices = () => {
  return (
    <div className="maxwellClass">
      <div className="text-center">
        <h2 className="headingClass">Our Services</h2>
        <div className="mb-10">
          <button className="buttonClass">Create It</button>
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
              className="outline-none focus:outline-none"
              draggable={false} // Prevent dragging
              onContextMenu={(e) => e.preventDefault()} // Disables right-click
            />
            <div>
              <h3 className=" text-[18px] md:text-[24px] text-center text-primary-orange">{service.title}</h3>
              <p className='textClass text-center'>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeServices;
