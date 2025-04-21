"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false); // Close mobile menu on route change
  }, [pathname]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 font-Poppins">
      <div className="w-full px-4 md:px-6 lg:px-6 xl:px-10 2xl:px-0 max-w-sm md:max-w-3xl lg:max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold">
            Max Writings
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6">
            <NavLink href="/" pathname={pathname}>
              Home
            </NavLink>
            <NavLink href="/blogs" pathname={pathname}>
              Blogs
            </NavLink>
            {/* Services Dropdown */}
            {/* <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 text-gray-800 hover:text-primary-orange transition"
              >
                Services <ChevronDown size={16} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-8 left-0 w-40 bg-white border rounded-md shadow-md">
                  <NavDropdownItem href="/services/academic-writing" pathname={pathname}>
                    Academic Writings
                  </NavDropdownItem>
                  <NavDropdownItem href="/services/home-pages" pathname={pathname}>
                    Home Pages
                  </NavDropdownItem>
                  <NavDropdownItem href="/services/product-pages" pathname={pathname}>
                    Product Pages
                  </NavDropdownItem>
                  <NavDropdownItem href="/services/seo-blogs" pathname={pathname}>
                    SEO Blogs
                  </NavDropdownItem>
                  <NavDropdownItem href="/services/social-media-posts" pathname={pathname}>
                    Social Media Posts
                  </NavDropdownItem>
                  <NavDropdownItem href="/services/website-building" pathname={pathname}>
                    Website Building
                  </NavDropdownItem>
                </div>
              )}
            </div> */}
            <NavLink href="/about-us" pathname={pathname}>
              About Us
            </NavLink>
            <NavLink href="/contact-us" pathname={pathname}>
              Contact Us
            </NavLink>


          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-800"
            aria-label="Mobile menu toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            <NavLink href="/" pathname={pathname}>
              Home
            </NavLink>
            <NavLink href="/blogs" pathname={pathname}>
              Blog
            </NavLink>

            <NavLink href="/about-us" pathname={pathname}>
              About Us
            </NavLink>
            <NavLink href="/contact-us" pathname={pathname}>
              Contact Us
            </NavLink>

            {/* Services Dropdown in Mobile */}
            {/* <div className="border-t pt-2">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex justify-between w-full text-gray-800 hover:text-primary-orange transition"
              >
                Services <ChevronDown size={16} />
              </button>
              {dropdownOpen && (
                <div className="pl-4 pt-2">
                  <NavDropdownItem href="/services/web-design" pathname={pathname}>
                    Web Design
                  </NavDropdownItem>
                  <NavDropdownItem href="/services/seo" pathname={pathname}>
                    SEO
                  </NavDropdownItem>
                  <NavDropdownItem href="/services/content-writing" pathname={pathname}>
                    Content Writing
                  </NavDropdownItem>
                </div>
              )}
            </div> */}
          </div>
        </div>
      )}
    </nav>
  );
};

// Helper components for styling active links
const NavLink = ({ href, pathname, children }: any) => (
  <Link href={href}>
    <span
      className={`${pathname === href ? "text-primary-orange border-b-2 border-primary-orange" : "text-gray-800"
        } hover:text-primary-orange transition px-2 py-2`}
    >
      {children}
    </span>
  </Link>
);

const NavDropdownItem = ({ href, pathname, children }: any) => (
  <Link href={href}>
    <span
      className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 ${pathname === href ? "text-primary-orange" : ""
        }`}
    >
      {children}
    </span>
  </Link>
);

export default Navbar;
