import { useState, useEffect } from "react";

const testimonials = [
  {
    quote: "Booking was super quick and easy!",
    role: "Traveler",
    seed: "alice123",
  },
  {
    quote: "Great interface and reliable service.",
    role: "Commuter",
    seed: "bob456",
  },
  {
    quote: "I love how simple everything is.",
    role: "Frequent Booker",
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
        
        // Use seed to get consistent user data for each testimonial
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

  // Fallback name for error state
  const displayName = userData?.name || "Anonymous User";
  const displayInitials = userData?.initials || "AU";

  return (
    <div className="card bg-base-100 shadow-lg p-4 sm:p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
      {/* Avatar with loading state */}
      <div className="avatar mb-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-base-300 flex items-center justify-center">
          {loading ? (
            <div className="loading loading-spinner loading-sm"></div>
          ) : error || !userData?.image ? (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-content font-bold text-lg">
              {displayInitials}
            </div>
          ) : (
            <img
              src={userData.image}
              alt={displayName}
              className="w-full h-full rounded-full object-cover"
              onError={handleImageError}
            />
          )}
        </div>
      </div>
      
      <blockquote className="text-sm sm:text-base italic mb-4 leading-relaxed">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      
      <cite className="not-italic">
        <p className="font-semibold text-sm sm:text-base">{displayName}</p>
        {testimonial.role && (
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            {testimonial.role}
          </p>
        )}
      </cite>
    </div>
  );
};

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full py-12 sm:py-16 lg:py-20 bg-base-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
          What Users Say
        </h2>
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard
              key={testimonial.seed}
              testimonial={testimonial}
              index={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
