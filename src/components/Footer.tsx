import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
const Footer = () => {
    return (
        <footer className=" bg-secondary-site text-white">
            <div className="maxwellClass pt-[8%]">
                <div className="grid grid-cols-4 gap-5 ">
                    <div className="col-span-4 md:col-span-4 lg:col-span-1">
                        <Image
                            src="/images/companylogo1.jpg"
                            width={100}
                            height={100}
                            alt="SEO"
                            className="outline-none focus:outline-none"
                            draggable={false} // Prevent dragging
                            onContextMenu={(e) => e.preventDefault()} // Disables right-click
                        />
                    </div>
                    {/* <div className="col-span-4 md:col-span-1 lg:col-span-1">
                        <h4 className="mb-4 text-[20px]  font-prosto">Services</h4>
                        <ul>
                            <li className="mb-2 text-[14px]">
                                <Link href="services/academic-writing">Academic Writing</Link>
                            </li>
                            <li className="mb-2 text-[14px]">
                                <Link href="services/home-pages">Home Pages</Link>
                            </li>
                            <li className="mb-2 text-[14px]">
                                <Link href="services/product-pages">Product Pages</Link>
                            </li>
                            <li className="mb-2 text-[14px]">
                                <Link href="services/seo-blogs">SEO Blogs</Link>
                            </li>
                            <li className="mb-2 text-[14px]">
                                <Link href="services/social-media-posts">Social Media Posts</Link>
                            </li>
                            <li className="mb-2 text-[14px]">
                                <Link href="services/website-building">Website Building</Link>
                            </li>
                        </ul>
                    </div> */}
                    <div className="col-span-4 md:col-span-2 lg:col-span-1">
                        <h4 className="mb-4 text-[20px]  font-prosto">Contact Us</h4>
                        <ul>
                            <li className="mb-2 text-[14px]">
                                <span className="flex justify-start items-center gap-3">
                                    <p>Phone:</p>
                                    <Link href="tel:+923136952876">+92 313-695-2876</Link>
                                </span>
                            </li>
                            <li className="mb-2 text-[14px]">
                                <span className="flex justify-start items-center gap-3">
                                    <p>Email:</p>
                                    <Link href="mailto:maxwritings@gmail.com">maxwritings@gmail.com</Link>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-4 md:col-span-1 lg:col-span-1">
                    <h4 className="mb-4 text-[20px]  font-prosto ">Social</h4>
                        <div className="flex justify-start items-center gap-3">
                            <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <Facebook size={24} className="text-blue-500 hover:text-blue-600 transition-all cursor-pointer" />
                            </Link>

                            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <Twitter size={24} className="text-blue-400 hover:text-blue-500 transition-all cursor-pointer" />
                            </Link>

                            <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <Instagram size={24} className="text-pink-500 hover:text-pink-600 transition-all cursor-pointer" />
                            </Link>

                            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <Linkedin size={24} className="text-blue-700 hover:text-blue-800 transition-all cursor-pointer" />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="text-center pt-20 pb-10">
                    <hr className="mb-3" />
                    <p>&copy; 2025 Max Writings. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
