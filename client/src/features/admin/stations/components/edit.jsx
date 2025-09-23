import { useParams } from "@tanstack/react-router";
import StationForm from "../components/StationForm";

export default function EditStationPage() {
  const { stationId } = useParams({ from: "/admin/stations/$stationId/edit" });

  return (
    <div className="flex justify-center items-start p-6 min-h-screen bg-gray-50">
      <StationForm isEditing={true} stationId={stationId} />
    </div>
  );
}
