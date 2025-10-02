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
      className="w-full h-max p-6 flex flex-col items-center justify-center gap-4 bg-base-200 md:h-full md:flex-row md:items-start md:justify-between"
    >
      <TrainForm />
      <TrainGallery />
    </section>
  );
}
