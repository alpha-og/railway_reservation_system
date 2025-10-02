import { Search, Ticket, CalendarCheck } from "lucide-react";
import { FeatureCard } from "../../../components/ui";

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
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
