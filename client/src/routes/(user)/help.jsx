import { createFileRoute } from "@tanstack/react-router";
import { 
  HelpCircle, 
  Search, 
  Ticket, 
  X, 
  User, 
  Settings,
  MessageCircle,
  Train,
  Clock,
  Shield,
  Heart
} from "lucide-react";

export const Route = createFileRoute("/(user)/help")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <HelpCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Help & Support
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Need assistance with our Railway Reservation System? 
              Check out the FAQs below or reach out via the Contact page.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>User Friendly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* FAQ Section */}
          <div className="grid gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">How can I search for trains?</h2>
                </div>
                <p className="text-base-content/80 leading-relaxed">
                  Go to the <span className="font-semibold text-primary">Search</span> page, enter your source,
                  destination, and travel date, then click on <span className="font-semibold">Search</span>. The
                  system will display available trains with schedules and seat availability.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Ticket className="h-6 w-6 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold">How do I book a ticket?</h2>
                </div>
                <p className="text-base-content/80 leading-relaxed">
                  Once you find a suitable train, click on <span className="font-semibold text-secondary">Book</span>,
                  select your preferred class/seat, fill in passenger details, and confirm your reservation.
                  Payment can be made securely through our integrated payment system.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
                    <X className="h-6 w-6 text-error" />
                  </div>
                  <h2 className="text-2xl font-bold">Can I cancel my booking?</h2>
                </div>
                <p className="text-base-content/80 leading-relaxed">
                  Yes. Go to the <span className="font-semibold text-error">My Bookings</span> section, select the
                  ticket you want to cancel, and click <span className="font-semibold">Cancel</span>. Refunds will
                  follow the project's cancellation policy and will be processed within 3-5 business days.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold">Do I need an account?</h2>
                </div>
                <p className="text-base-content/80 leading-relaxed">
                  Yes. Passengers must create an account to book and manage tickets,
                  while administrators can log in with special privileges to manage
                  train schedules and reservations. Account creation is free and secure.
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <Settings className="h-6 w-6 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold">What technologies are used?</h2>
                </div>
                <p className="text-base-content/80 leading-relaxed">
                  The system is built using <span className="font-semibold text-success">React + Tailwind CSS</span> for
                  frontend, <span className="font-semibold text-success">Node.js / Express</span> for backend, and
                  <span className="font-semibold text-success"> MySQL / PostgreSQL</span> for database management.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-16">
            <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-2xl">
              <div className="card-body py-12 text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Still Need Help?
                </h2>
                <p className="text-xl opacity-90 mb-6">
                  Our support team is ready to assist you with any questions
                </p>
                <div className="card-actions justify-center">
                  <a href="/contact" className="btn btn-white btn-lg gap-3">
                    <MessageCircle className="h-6 w-6" />
                    Contact Support
                  </a>
                  <a
                    href="/trains"
                    className="btn btn-ghost btn-lg text-white border-white hover:bg-white hover:text-primary"
                  >
                    <Train className="h-6 w-6" />
                    Book Trains
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-base-content/50">
              © Railway Reservation System – DBMS Mini Project
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
