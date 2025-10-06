// client/src/routes/admin/stations/index.jsx

import { createFileRoute } from "@tanstack/react-router";
import StationsList from "../../../features/admin/stations/components/StationsList.jsx";

export const Route = createFileRoute("/admin/stations/")({
  component: StationsPage,
});

function StationsPage() {
  return <StationsList />;
}