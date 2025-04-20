'use client';

import { CheckCircle, XCircle } from 'lucide-react';

const pricingPlans = [
    {
        title: 'Standard',
        smallTitle: "Best for Starters",
        price: '$29 per 1000 words',
        features: ['Grammarly Checked', 'Hemingway Checked', 'Custom Comparison tables', 'Basic AI test score List item', 'Search Intent and Audiance Targeting', 'Specialized Picture according to content'],
        notIncluded: [],
    },
    {
        title: 'All-in-One',
        smallTitle: "Best for Business – Highest Sale",
        price: '$39 per 1000 words',
        features: [' Grammarly Checked', 'Hemingway Checked', ' Internal & External Links', 'Custom Comparison tables', 'Search Intent and Audiance Targeting', 'Specialized Picture according to content', 'SEO-optimized with Surfer SEO & Semrush', ' Passive Voice and Long Sentances checking', 'Copyleaks / Originality.AI / Quill bot For AI Checking'],
        notIncluded: [],
    },
    {
        title: 'Quickest 12-Hour',
        smallTitle: "Best for Urgent Work",
        price: '$79 per 1000 words',
        features: ['Priority work within 12 hours', 'Grammarly Checked', 'Hemingway Checked', 'Internal & External Links', 'Custom Comparison tables', 'Search Intent and Audience Targeting', 'Specialized Picture according to content', 'SEO-optimized with Surfer SEO & Semrush', 'Passive Voice and Long Sentences checking', 'Copyleaks / Originality.AI / Quill bot For AI Checking'],
        notIncluded: [],
    },
];

const HomePrices = () => {
    return (
        <div className="maxwellClass pt-5 pb-20 md:grid md:grid-cols-1 justify-center items-center ">
            <div className='block'>
                <div className="text-center">
                    <h2 className="headingClass lg:pb-5">Our Prices</h2>
                    {/* <div className="mb-10">
                        <button className="buttonClass">Create It</button>
                    </div> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {pricingPlans.map((plan, index) => (
                        <div
                            key={index}
                            className={`border border-gray-700 p-6 rounded-xl bg-gray-900 text-white shadow-lg flex flex-col ${index === 1 ? 'lg:scale-110 lg:py-12' : 'lg:py-8'
                                }`}
                        >
                            <h3 className="text-2xl font-semibold text-primary-orange">{plan.title}</h3>
                            <p className="text-xl font-semibold mt-2">{plan.price}</p>

                            <ul className="mt-4 space-y-2 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <CheckCircle className="text-green-400" size={18} />
                                        {feature}
                                    </li>
                                ))}
                                {plan.notIncluded.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-500">
                                        <XCircle className="text-red-500" size={18} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto pt-4">
                                <button className="bg-primary-orange text-white font-semibold py-3 px-5 rounded-lg w-full hover:bg-orange-400 transition-all">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePrices;
