import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import trainAdminService from "../services/trainAdmin.service";

export default function TrainView({ trainId }) {
  const navigate = useNavigate();
  const [train, setTrain] = useState(null);
  const [coachTypes, setCoachTypes] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [train, coachTypesRes, seatTypesRes] = await Promise.all([
          trainAdminService.getTrain(trainId),
          trainAdminService.getCoachTypes(),
          trainAdminService.getSeatTypes(),
        ]);
        if (ignore) return;
        setTrain(train);
        setCoachTypes(coachTypesRes);
        setSeatTypes(seatTypesRes);
      } catch (e) {
        setError(e.message || "Failed to load train or type data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [trainId]);

  if (loading) return <div className="p-8 text-lg">Loading...</div>;
  if (error) return <div className="p-8 text-lg text-red-600">{error}</div>;
  if (!train) return <div>Train not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">{train.name}</h2>
        <button
          className="btn btn-outline"
          onClick={() =>
            navigate({
              to: "/admin/trains/$trainId/edit",
              params: { trainId },
            })
          }
        >
          Edit
        </button>
      </div>
      <div className="mb-3"><b>Train Code:</b> {train.code}</div>
      <div>
        <h3 className="font-semibold text-lg mb-2">Coaches</h3>
        {(!train.coaches?.length) ? (
          <div>No coaches found.</div>
        ) : (
          train.coaches.map((coach, i) => {
            const seatTypeMap = {};
            (coach.seats || []).forEach(seat => {
              if (!seatTypeMap[seat.seat_type_id]) {
                seatTypeMap[seat.seat_type_id] = { seat_type_id: seat.seat_type_id, seat_count: 0 };
              }
              seatTypeMap[seat.seat_type_id].seat_count += 1;
            });
            return (
              <div key={coach.code || i} className="mb-4 border p-3 rounded bg-gray-900 text-yellow-100">
                <div><b>Type:</b> {coachTypes.find(ct => ct.id === coach.coach_type_id)?.name || coach.coach_type_id}</div>
                <div><b>Code:</b> {coach.code}</div>
                <div><b>Fare per km:</b> {coach.fare_per_km}</div>
                <div>
                  <b>Seats:</b>
                  <ul className="ml-5 list-disc">
                    {Object.values(seatTypeMap).map(seat => (
                      <li key={seat.seat_type_id}>
                        {seatTypes.find(st => st.id === seat.seat_type_id)?.name || seat.seat_type_id} x {seat.seat_count}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="mt-4">
        <button
          className="btn btn-secondary"
          onClick={() => navigate({ to: "/admin/trains" })}
        >
          Back to List
        </button>
      </div>
    </div>
  );
}