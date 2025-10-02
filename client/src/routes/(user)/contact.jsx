import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Send,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  User,
  CheckCircle,
  Train,
  Users,
  Heart,
  Shield,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/(user)/contact")({
  component: RouteComponent,
});

function RouteComponent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              We're here to help make your railway journey exceptional. Reach
              out to us for support, feedback, or any inquiries.
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
                <Zap className="h-5 w-5" />
                <span>Quick Response</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container h-full mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="h-full lg:col-span-2">
            <div className="h-full card bg-base-100 shadow-2xl">
              <div className="card-body p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Send className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Send us a Message</h2>
                    <p className="text-base-content/70">
                      We'll get back to you within 24 hours
                    </p>
                  </div>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-10 w-10 text-success" />
                    </div>
                    <h3 className="text-2xl font-bold text-success mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-base-content/70">
                      Thank you for reaching out. We'll respond soon.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="h-full flex flex-col justify-evenly space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Full Name
                          </span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="input input-bordered input-lg w-full focus:input-primary"
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Address
                          </span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="input input-bordered input-lg w-full focus:input-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Subject
                        </span>
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="select select-bordered select-lg w-full focus:select-primary"
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="booking">Booking Issues</option>
                        <option value="feedback">Feedback</option>
                        <option value="refund">Refund Request</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          Message
                        </span>
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="6"
                        placeholder="Tell us how we can help you..."
                        className="textarea textarea-bordered textarea-lg w-full focus:textarea-primary"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-lg w-full gap-3"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information & Team */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-base-content/70 text-sm">
                        Railway Reservation System
                        <br />
                        College Campus
                        <br />
                        Kerala, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-base-content/70 text-sm">
                        +91 9876543210
                      </p>
                      <p className="text-base-content/70 text-sm">
                        Toll Free: 1800-123-4567
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-base-content/70 text-sm">
                        support@railwayreservation.com
                      </p>
                      <p className="text-base-content/70 text-sm">
                        info@railwayreservation.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Support Hours</h4>
                      <p className="text-base-content/70 text-sm">
                        24/7 Customer Support
                      </p>
                      <p className="text-base-content/70 text-sm">
                        Emergency: Always Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <a
                    href="/help"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    <Train className="h-5 w-5 text-primary" />
                    <span>Help Center</span>
                  </a>
                  <a
                    href="/about"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    <Heart className="h-5 w-5 text-error" />
                    <span>About Us</span>
                  </a>
                  <a
                    href="/trains"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    <Train className="h-5 w-5 text-secondary" />
                    <span>Book Tickets</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-2xl">
            <div className="card-body py-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl opacity-90 mb-6">
                Book your train tickets with ease and confidence
              </p>
              <div className="card-actions justify-center">
                <a href="/trains" className="btn btn-white btn-lg gap-3">
                  <Train className="h-6 w-6" />
                  Book Now
                </a>
                <a
                  href="/help"
                  className="btn btn-ghost btn-lg text-white border-white hover:bg-white hover:text-primary"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
