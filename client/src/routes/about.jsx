import { createFileRoute } from "@tanstack/react-router";
import {
  Info,
  Sparkles,
  Wrench,
  Users,
  Heart,
  Train,
  Database,
  Code,
  Shield,
  Zap,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  component: RouteComponent,
});

function RouteComponent() {
  const teamMembers = [
    { 
      name: "Athul Anoop", 
      role: "Full Stack Developer",
      color: "primary",
    },
    { 
      name: "Jil Varghese Palliyan", 
      role: "Frontend Developer",
      color: "secondary", 
    },
    { 
      name: "Bhavana Harikrishnan", 
      role: "Backend Developer",
      color: "accent",
    },
    { 
      name: "Gopika Sreekumar", 
      role: "Backend Developer",
      color: "success",
    },
    { 
      name: "R Sandra Unni", 
      role: "Frontend Developer",
      color: "warning",
    },
  ];

  const features = [
    { text: "Search trains by route and date", icon: Train },
    { text: "View schedules and seat availability", icon: Clock },
    { text: "Book and cancel tickets securely", icon: Shield },
    { text: "Passenger & admin login system", icon: Users },
  ];

  const techStack = [
    { name: "React + Tailwind CSS", type: "Frontend", color: "primary" },
    { name: "Node.js / Express", type: "Backend", color: "secondary" },
    { name: "PostgreSQL", type: "Database", color: "accent" },
    { name: "Git & GitHub", type: "Version Control", color: "success" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Info className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              About Our System
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              A comprehensive Railway Reservation System built as a DBMS mini
              project, demonstrating practical database concepts and real-world
              application development.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                <span>Database Driven</span>
              </div>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                <span>Modern Tech Stack</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Team Project</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* About Section */}
          <div className="card bg-base-100 shadow-xl mb-12">
            <div className="card-body p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">About This Project</h2>
              </div>
              <p className="text-base-content/80 text-lg leading-relaxed">
                This Railway Reservation System is a DBMS mini project designed
                to handle train bookings, cancellations, and schedule
                management. It demonstrates practical database concepts like
                relational schemas, SQL queries, and user role management while
                simulating a real-world railway reservation workflow with modern
                web technologies.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="card bg-gradient-to-br from-success/10 to-success/5 shadow-xl mb-12">
            <div className="card-body p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-success" />
                </div>
                <h2 className="text-3xl font-bold">Key Features</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-base-100 rounded-lg shadow-sm"
                    >
                      <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-success" />
                      </div>
                      <span className="text-base-content/80 font-medium">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="card bg-gradient-to-br from-warning/10 to-warning/5 shadow-xl mb-12">
            <div className="card-body p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <Wrench className="h-6 w-6 text-warning" />
                </div>
                <h2 className="text-3xl font-bold">Technology Stack</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {techStack.map((tech, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`w-16 h-16 bg-${tech.color}/10 rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <Code className={`h-8 w-8 text-${tech.color}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{tech.name}</h3>
                    <p className="text-base-content/60 text-sm">{tech.type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="card bg-gradient-to-br from-info/10 to-info/5 shadow-xl mb-12">
            <div className="card-body p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-info" />
                </div>
                <h2 className="text-3xl font-bold">Our Team</h2>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {teamMembers.map((member, index) => {
                  return (
                    <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 w-full max-w-xs sm:w-64">
                      <div className="card-body p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                          <img 
                            src="" 
                            alt={`${member.name} profile`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-base-content">{member.name}</h3>
                        <p className="text-base-content/70 font-medium text-sm">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-2xl">
            <div className="card-body py-12 text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Ready to Experience Our System?
              </h2>
              <p className="text-xl opacity-90 mb-6">
                Try booking your first train ticket with our user-friendly
                interface
              </p>
              <div className="card-actions justify-center">
                <a href="/trains" className="btn btn-white btn-lg gap-3">
                  <Train className="h-6 w-6" />
                  Start Booking
                </a>
                <a
                  href="/contact"
                  className="btn btn-ghost btn-lg text-white border-white hover:bg-white hover:text-primary"
                >
                  <Users className="h-6 w-6" />
                  Contact Team
                </a>
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

