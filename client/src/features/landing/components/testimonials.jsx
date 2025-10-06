import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "SideTrack made booking my daily commute so much easier. No more waiting in long queues!",
    role: "Daily Commuter",
    rating: 5,
    seed: "alice123",
  },
  {
    quote: "Finally, a railway booking app that actually works. Fast, reliable, and user-friendly.",
    role: "Business Traveler",
    rating: 5,
    seed: "bob456",
  },
  {
    quote: "I've saved hours of time with SideTrack's smart search. Highly recommend to all travelers.",
    role: "Weekend Explorer",
    rating: 5,
    seed: "clara789",
  },
];

const TestimonialCard = ({ testimonial, index }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const response = await fetch(`https://randomuser.me/api/?seed=${testimonial.seed}&gender=${index % 2 === 0 ? 'female' : 'male'}`);
        const data = await response.json();
        
        if (data.results && data.results[0]) {
          const user = data.results[0];
          setUserData({
            name: `${user.name.first} ${user.name.last}`,
            image: user.picture.large,
            initials: `${user.name.first.charAt(0)}${user.name.last.charAt(0)}`
          });
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [testimonial.seed, index]);

  const handleImageError = () => {
    setError(true);
    setLoading(false);
  };

  const displayName = userData?.name || "Anonymous User";
  const displayInitials = userData?.initials || "AU";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -10,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="group relative"
    >
      {/* Glass Morphism Card using DaisyUI */}
      <div className="card bg-base-100/50 backdrop-blur-xl border border-base-content/10 shadow-2xl h-full overflow-hidden">
        
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Quote Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ delay: (index * 0.2) + 0.3, duration: 0.6 }}
          className="absolute top-6 right-6 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"
        >
          <Quote className="w-4 h-4 text-primary" />
        </motion.div>
        
        <div className="card-body relative z-10 flex flex-col h-full">
          {/* Stars Rating */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: (index * 0.2) + 0.4, duration: 0.6 }}
            className="flex gap-1 mb-6"
          >
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: 180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: (index * 0.2) + 0.5 + (i * 0.1), 
                  duration: 0.3,
                  type: "spring",
                  stiffness: 300
                }}
              >
                <Star className="w-5 h-5 fill-warning text-warning" />
              </motion.div>
            ))}
          </motion.div>
          
          {/* Quote */}
          <motion.blockquote 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: (index * 0.2) + 0.6, duration: 0.8 }}
            className="text-lg leading-relaxed text-base-content mb-8 flex-grow italic"
          >
            "{testimonial.quote}"
          </motion.blockquote>
          
          {/* User Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: (index * 0.2) + 0.8, duration: 0.6 }}
            className="flex items-center gap-4"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="avatar">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20">
                  {loading ? (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                      <span className="loading loading-spinner loading-sm text-primary"></span>
                    </div>
                  ) : error || !userData?.image ? (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-primary-content font-bold text-lg">
                      {displayInitials}
                    </div>
                  ) : (
                    <img
                      src={userData.image}
                      alt={displayName}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  )}
                </div>
              </div>
              
              {/* Avatar Glow */}
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
            
            {/* User Details */}
            <div>
              <p className="font-semibold text-base-content text-lg">{displayName}</p>
              <p className="text-primary text-sm">{testimonial.role}</p>
            </div>
          </motion.div>
        </div>
        
        {/* Border Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
      </div>
    </motion.div>
  );
};

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-32 bg-base-300 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-warning/5 via-info/5 to-success/5" />
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px]" />
      
      <div className="relative z-10 container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="badge badge-warning badge-lg gap-2 px-4 py-3 mb-6"
          >
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">5-Star Reviews</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-base-content">
              Loved by
            </span>
            <br />
            <span className="text-warning">
              Thousands
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-base-content/80 max-w-3xl mx-auto leading-relaxed"
          >
            Real feedback from travelers who choose SideTrack for their journeys.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 lg:gap-12 lg:grid-cols-3 max-w-7xl mx-auto mb-20">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.seed}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-full"
        >
          <div className="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-100/50 backdrop-blur-xl border border-base-content/10 w-full">
            {[
              { title: "Happy Customers", value: "50K+", desc: "Satisfied travelers" },
              { title: "5-Star Reviews", value: "98%", desc: "Customer satisfaction" },
              { title: "Uptime", value: "99.9%", desc: "Service reliability" },
              { title: "Support Response", value: "<1min", desc: "Average response time" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="stat place-items-center"
              >
                <div className="stat-title text-base-content/60 text-sm lg:text-base">{stat.title}</div>
                <div className="stat-value text-primary text-2xl lg:text-4xl">{stat.value}</div>
                <div className="stat-desc text-base-content/80 text-xs lg:text-sm">{stat.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        animate={{
          y: [-30, 30, -30],
          rotate: [0, 15, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-32 right-20 w-40 h-40 bg-warning/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [30, -30, 30],
          rotate: [0, -15, 0],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-32 left-20 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"
      />
    </section>
  );
}