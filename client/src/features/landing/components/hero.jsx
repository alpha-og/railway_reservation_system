import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Train } from "lucide-react";

export default function Hero() {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen overflow-hidden bg-base-300"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,oklch(var(--color-primary)/0.05)_50%,transparent_75%)]" />
        
        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-40 right-20 w-24 h-24 bg-secondary/20 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [-15, 15, -15],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-32 left-1/4 w-12 h-12 bg-accent/20 rounded-full blur-sm"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-6 lg:px-8">
          
          {/* Left-Right Split Layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
            
            {/* LEFT SIDE - Large Text */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Smart Railway Booking</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9]"
              >
                <span className="block text-base-content">Book Smarter,</span>
                <span className="block text-primary">
                  Travel Better
                </span>
                <motion.span 
                  className="block text-base-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  with <span className="text-primary font-extrabold">SideTrack</span>
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* RIGHT SIDE - Small Text + CTAs */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="space-y-8 lg:pl-8"
            >
              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg lg:text-xl text-base-content/80 leading-relaxed"
              >
                Fast, reliable train bookings with real-time updates and 
                <span className="text-primary font-semibold"> intelligent search</span>. 
                Find your perfect journey in seconds.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Link 
                    to="/signup"
                    className="btn btn-primary btn-lg px-8 py-4 gap-2 shadow-2xl shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300 whitespace-nowrap w-full sm:w-auto"
                  >
                    <Train className="w-5 h-5 flex-shrink-0" />
                    <span>Book Now</span>
                    <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="#features"
                    className="btn btn-outline btn-lg px-8 py-4 backdrop-blur-sm transition-all duration-300 whitespace-nowrap w-full sm:w-auto"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex gap-8 pt-6 border-t border-base-content/10"
              >
                {[
                  { label: "Routes", value: "500+" },
                  { label: "Passengers", value: "1M+" },
                  { label: "Satisfaction", value: "99%" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="text-xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-base-content/60">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base-200 to-transparent" />
    </section>
  );
}
