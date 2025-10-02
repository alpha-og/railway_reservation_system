import { Link } from "@tanstack/react-router";

export default function Hero() {
  return (
    <section id="hero" className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse max-w-7xl mx-auto px-4">
        {/* Hero Image / Illustration */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <img
            src="/logo.png"
            alt="Railway Reservation Illustration"
            className="w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg rounded-lg shadow-2xl"
          />
        </div>

        {/* Hero Text */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4">
            Welcome to <span className="text-primary">SideTrack</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl opacity-80 mb-6 max-w-2xl">
            Seamless railway reservations made simple. Discover train schedules,
            book tickets, and manage your journeys—all in one intuitive
            platform.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <Link className="btn btn-primary btn-sm sm:btn-md lg:btn-lg w-full sm:w-auto" to="/signup">
              Get Started
            </Link>
            <Link className="btn btn-outline btn-sm sm:btn-md lg:btn-lg w-full sm:w-auto" to="#features">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
