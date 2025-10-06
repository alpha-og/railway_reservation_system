import { Search, Ticket, CalendarCheck } from "lucide-react";
import { motion } from "motion/react";
import { FeatureCard } from "../../../components/ui";

const features = [
  {
    title: "Smart Search",
    description: "Find the perfect route instantly with intelligent filters for time, price, and seating preferences.",
    icon: Search,
  },
  {
    title: "Instant Booking",
    description: "Lightning-fast reservations with secure payments and immediate ticket confirmation.",
    icon: Ticket,
  },
  {
    title: "Easy Management",
    description: "Modify, cancel, or track your bookings effortlessly with our intuitive dashboard.",
    icon: CalendarCheck,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 bg-base-200 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,oklch(var(--color-primary)/0.03)_50%,transparent_75%)]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="badge badge-primary badge-lg gap-2 px-4 py-3 mb-6"
          >
            <span className="w-2 h-2 bg-primary-content rounded-full animate-pulse" />
            <span className="font-medium">Why Choose SideTrack</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-base-content">
              Built for
            </span>
            <br />
            <span className="text-primary">
              Efficiency
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-base-content/80 max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need for seamless train bookings. 
            Simple, fast, and reliable.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-3 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              index={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              className="h-full"
            />
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-20"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <a 
              href="#testimonials"
              className="btn btn-outline btn-lg px-8 py-4 gap-2 whitespace-nowrap"
            >
              <span>See Reviews</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-current flex-shrink-0"
              >
                →
              </motion.div>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 10, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
      />
      <motion.div
        animate={{
          y: [20, -20, 20],
          rotate: [0, -10, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/10 rounded-full blur-2xl"
      />
    </section>
  );
}