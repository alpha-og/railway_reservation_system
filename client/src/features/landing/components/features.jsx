import { Search, Ticket, CalendarCheck } from "lucide-react";

const features = [
  {
    title: "Search Trains",
    description: "Find available trains across routes and dates.",
    icon: Search,
  },
  {
    title: "Book Tickets",
    description: "Reserve seats with just a few clicks.",
    icon: Ticket,
  },
  {
    title: "Manage Bookings",
    description: "View, modify, or cancel existing reservations.",
    icon: CalendarCheck,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-base-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12">
          Features
        </h2>
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="card bg-neutral text-neutral-content shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center mb-4 sm:mb-6">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary-content" />
                  </div>
                  <h3 className="card-title text-base sm:text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
