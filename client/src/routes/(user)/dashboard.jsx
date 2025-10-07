import { createFileRoute } from "@tanstack/react-router";
import {
  Hero,
  Features,
  Testimonials,
  Footer,
} from "../../features/landing/components/";
import ScrollToTop from "../../components/ScrollToTop";

export const Route = createFileRoute("/(user)/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
