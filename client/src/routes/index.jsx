import { createFileRoute } from "@tanstack/react-router";
import {
  Hero,
  Features,
  Testimonials,
  Footer,
} from "../features/landing/components/";
import ScrollToTop from "../components/ScrollToTop";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-900">
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
