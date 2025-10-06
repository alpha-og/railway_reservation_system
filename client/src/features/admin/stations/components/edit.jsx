// client/src/features/admin/stations/components/edit.jsx

import { useParams } from "@tanstack/react-router";
import StationForm from "./StationForm.jsx";

function EditStation() {
  const { stationId } = useParams();

  return <StationForm stationId={stationId} isEdit={true} />;
}

export default EditStation;
