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

  if (loading) return <div className="p-8 text-lg text-yellow-200">Loading...</div>;
  if (error) return <div className="p-8 text-lg text-red-400">{error}</div>;
  if (!train) return <div className="text-yellow-200">Train not found.</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-[#21212b] text-yellow-100 rounded-2xl shadow-lg border border-yellow-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-yellow-200">{train.name}</h2>
        <button
          className="btn btn-outline border-yellow-600 text-yellow-300 hover:bg-yellow-900 hover:text-yellow-50"
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
      <div className="mb-5 text-lg">
        <b className="text-yellow-400">Train Code:</b> <span className="font-mono">{train.code}</span>
      </div>
      <h3 className="font-semibold text-xl mb-4 text-yellow-400 tracking-wide">Coaches</h3>
      {(!train.coaches?.length) ? (
        <div className="text-yellow-300 py-4">No coaches found.</div>
      ) : (
        <div className="space-y-6">
          {train.coaches.map((coach, i) => {
            const coachTypeLabel = coach.coach_type_name
              || (coachTypes.find(ct => String(ct.id) === String(coach.coach_type_id))?.name)
              || coach.coach_type_id
              || "Unknown";

            const seatTypeMap = {};
            (coach.seats || []).forEach(seat => {
              const seatTypeLabel = seat.seat_type_name
                || (seatTypes.find(st => String(st.id) === String(seat.seat_type_id))?.name)
                || seat.seat_type_id
                || "Unknown Seat Type";
              if (!seatTypeMap[seatTypeLabel]) seatTypeMap[seatTypeLabel] = 0;
              seatTypeMap[seatTypeLabel]++;
            });

            return (
              <div
                key={coach.code || i}
                className="border border-yellow-700 rounded-xl bg-[#282836] p-5 shadow-sm"
              >
                <div className="flex flex-wrap gap-x-6 gap-y-2 items-center text-lg mb-2">
                  <span>
                    <b className="text-yellow-300">Coach Code:</b>{" "}
                    <span className="font-mono">{coach.code}</span>
                  </span>
                  <span>
                    <b className="text-yellow-300">Type:</b>{" "}
                    <span>{coachTypeLabel}</span>
                  </span>
                </div>
                <div className="ml-2 mt-1">
                  <div className="font-bold text-yellow-400 mb-1">Seats:</div>
                  <ul className="space-y-1">
                    {Object.entries(seatTypeMap).length === 0 && <li className="text-yellow-200">No seats</li>}
                    {Object.entries(seatTypeMap).map(([seatTypeLabel, count]) => (
                      <li key={seatTypeLabel} className="pl-2">
                        <span className="font-semibold text-yellow-300">{seatTypeLabel}</span>: {count}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-8 flex gap-3">
        <button
          className="btn btn-secondary border-yellow-600 text-yellow-200 hover:bg-yellow-800 hover:text-yellow-50"
          onClick={() => navigate({ to: "/admin/trains" })}
        >
          Back to List
        </button>
      </div>
    </div>
  );
}