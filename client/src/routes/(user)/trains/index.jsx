import { createFileRoute } from "@tanstack/react-router";
import {
  TrainForm,
  TrainGallery,
} from "../../../features/user/trains/components";
export const Route = createFileRoute("/(user)/trains/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section
      id="search"
      className="h-full p-6 flex flex-col items-center justify-center gap-4 bg-base-200 md:flex-row"
    >
      <TrainForm />
      <TrainGallery />
    </section>
  );
}
