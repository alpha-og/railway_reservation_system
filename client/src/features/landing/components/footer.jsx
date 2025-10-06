import React from "react";
import { motion } from "motion/react";
import { Train, Heart, Mail, Phone, MapPin } from "lucide-react";

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

const contactInfo = [
  { icon: Mail, label: "hello@sidetrack.com" },
  { icon: Phone, label: "+1 (555) 123-4567" },
  { icon: MapPin, label: "New York, NY" },
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-base-300 to-base-200 text-base-content overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(var(--p)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(var(--s)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(var(--p)/0.02)_50%,transparent_75%)]" />
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--bc)/0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--bc)/0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            {/* Brand Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center">
                  <Train className="w-6 h-6 text-primary-content" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  SideTrack
                </span>
              </div>
              
              <p className="text-base-content/70 text-lg leading-relaxed mb-8 max-w-md">
                Smart railway booking made simple. 
                Find, book, and manage your train journeys effortlessly.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="flex items-center gap-3 text-base-content/70 hover:text-primary transition-colors duration-300"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Links Sections */}
            {footerData.map((section, sectionIndex) => (
              <motion.div 
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIndex * 0.1, duration: 0.8 }}
                className="flex flex-col"
              >
                <h3 className="text-lg font-semibold mb-6 text-base-content">
                  {section.title}
                </h3>
                <div className="flex flex-col space-y-4">
                  {section.links.map((link, linkIndex) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (sectionIndex * 0.1) + (linkIndex * 0.05), duration: 0.6 }}
                      whileHover={{ x: 5, transition: { duration: 0.2 } }}
                      className="text-base-content/70 hover:text-primary transition-all duration-300 hover:underline decoration-primary/50"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Newsletter Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="lg:col-span-5 pt-8"
            >
              <div className="bg-gradient-to-r from-base-100/50 to-base-100/30 backdrop-blur-sm border border-base-content/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  Stay Updated
                </h3>
                <p className="text-base-content/70 text-center mb-6">
                  Get the latest updates on new routes, features, and exclusive offers.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input input-bordered flex-1 bg-base-100/50 border-base-content/20 focus:border-primary placeholder-base-content/50"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary btn-lg px-8 py-4 shadow-lg whitespace-nowrap"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-base-content/10 py-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Copyright */}
            <p className="text-base-content/60 text-center lg:text-left">
              © {new Date().getFullYear()} SideTrack. Built with{" "}
              <Heart className="inline w-4 h-4 text-error fill-error" />{" "}
              for better travel experiences.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-6">
              <span className="text-base-content/60 text-sm">Follow us:</span>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-gradient-to-r from-base-100/50 to-base-100/30 hover:from-primary/20 hover:to-secondary/20 rounded-full flex items-center justify-center border border-base-content/20 hover:border-primary/50 transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-2xl"
      />
      <motion.div
        animate={{
          y: [20, -20, 20],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-10 w-24 h-24 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-2xl"
      />
    </footer>
  );
}
