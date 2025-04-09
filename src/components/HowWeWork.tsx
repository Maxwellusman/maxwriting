import { useState } from 'react';
import Link from 'next/link';

export default function HowWeWork() {
    const [hoveredItem, setHoveredItem] = useState(0);

    const workItems = [
        {
            id: 1,
            title: "Brainstorming",
            description: "Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated",
            cta: "Learn More",
            href: ""
        },
        {
            id: 2,
            title: "Analysing",
            description: "Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line solely on the bottom line.",
            cta: "Learn More",
            href: ""
        },
        {
            id: 3,
            title: "News Publishing",
            description: "Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.",
            cta: "Learn More",
            href: ""
        }
    ];

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="font-raleway text-[20px] mb-5">
                    HOW WE WORK
                </h2>
                
                {/* Fixed grid classes here */}
                <div className='grid grid-cols-1 lg:grid-cols-2 xl:gap-8 xl:pb-8'>
                    <div className='col-span-1'>
                        <p className="text-[24px] md:text-[30px] lg:text-[40px] leading-tight font-bold font-raleway mb-0 text-primary-orange">
                            I will show you how <br className='hidden xl:block' /> our team works
                        </p>
                    </div>
                    <div className='col-span-1'>
                        <p className="textClass">
                            Bring to the table win-win market strategies to ensure perfect articles. 
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {workItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`relative p-8 rounded-lg transition-all duration-300 ${hoveredItem === index ? 'bg-orange-50 shadow-lg' : 'bg-gray-50 shadow-md'}`}
                            onMouseEnter={() => setHoveredItem(index)}
                            onMouseLeave={() => setHoveredItem(0)}
                        >
                            <div className={`absolute top-8 left-8 text-4xl font-bold ${hoveredItem === index ? 'text-primary-orange' : 'text-gray-300'}`}>
                                0{item.id}
                            </div>

                            <div className="pt-16">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">{item.title}</h3>
                                <p className="text-gray-600 mb-6">{item.description}</p>

                                {item.cta && (
                                    <Link
                                        href={item.href}
                                        className={`inline-block font-medium ${hoveredItem === index ? 'text-primary-orange hover:text-primary-orange' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {item.cta} →
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}