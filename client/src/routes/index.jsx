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
    <div className="flex flex-col items-center justify-center">
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
}
