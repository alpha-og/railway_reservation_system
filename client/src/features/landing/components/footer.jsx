import React from "react";

const footerData = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Help Center", href: "/help" },
      { label: "Developer API", href: "/api" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const socialLinks = [
  { icon: "👍", href: "https://facebook.com", label: "Facebook" },
  { icon: "🐦", href: "https://twitter.com", label: "Twitter" },
  { icon: "📸", href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-neutral text-neutral-content">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="footer py-8 sm:py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {footerData.map((col) => (
            <nav key={col.title} className="flex flex-col">
              <span className="footer-title text-sm sm:text-base font-semibold mb-3 sm:mb-4">
                {col.title}
              </span>
              <div className="flex flex-col space-y-2">
                {col.links.map((link) => (
                  <a 
                    key={link.href} 
                    href={link.href} 
                    className="link link-hover text-xs sm:text-sm opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>
          ))}

          {/* Social Links */}
          <nav className="col-span-2 sm:col-span-1">
            <span className="footer-title text-sm sm:text-base font-semibold mb-3 sm:mb-4">
              Connect with us
            </span>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {socialLinks.map((soc, idx) => (
                <a 
                  key={idx} 
                  href={soc.href} 
                  className="link link-hover text-xl sm:text-2xl hover:scale-110 transition-transform"
                  aria-label={soc.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </nav>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-neutral-content/20 py-4 sm:py-6 text-center">
          <p className="text-xs sm:text-sm opacity-80">
            © {new Date().getFullYear()} SideTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
