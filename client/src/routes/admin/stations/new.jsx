// client/src/routes/admin/stations/new.jsx

import { createFileRoute } from "@tanstack/react-router";
import StationForm from "../../../features/admin/stations/components/StationForm.jsx";

export const Route = createFileRoute("/admin/stations/new")({
  component: NewStationPage,
});

function NewStationPage() {
  return <StationForm isEdit={false} />;
}
