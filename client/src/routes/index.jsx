import { createFileRoute } from "@tanstack/react-router";
import {
  Hero,
  Features,
  Testimonials,
  Footer,
} from "../features/landing/components/";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
}
