import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import trainAdminService from "../services/trainAdmin.service";

export default function TrainEdit({ trainId }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [coachTypes, setCoachTypes] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setName(train.name || "");
        setCode(train.code || "");
        setCoachTypes(coachTypesRes);
        setSeatTypes(seatTypesRes);
        setCoaches((train.coaches || []).map(coach => {
          const seatTypeMap = {};
          (coach.seats || []).forEach(seat => {
            if (!seatTypeMap[seat.seat_type_id]) {
              seatTypeMap[seat.seat_type_id] = { seat_type_id: seat.seat_type_id, seat_count: 0 };
            }
            seatTypeMap[seat.seat_type_id].seat_count += 1;
          });
          return {
            code: coach.code,
            coach_type_id: coach.coach_type_id,
            fare_per_km: coach.fare_per_km,
            seat_types: Object.values(seatTypeMap),
            seatTypeToAdd: "",
            isEditing: false,
          };
        }));
      } catch (e) {
        setError(e.message || "Failed to load train or type data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [trainId]);

  // --- Handlers ---
  const handleAddCoach = () => setCoaches(prev => [
    ...prev,
    {
      code: "",
      coach_type_id: "",
      fare_per_km: "",
      seat_types: [],
      seatTypeToAdd: "",
      isEditing: true,
    },
  ]);
  const handleRemoveCoach = idx => setCoaches(prev => prev.filter((_, i) => i !== idx));
  const handleCoachTypeChange = (idx, coach_type_id) => setCoaches(prev =>
    prev.map((coach, i) =>
      i === idx
        ? { ...coach, coach_type_id, fare_per_km: "", seat_types: [], seatTypeToAdd: "", isEditing: true }
        : coach
    )
  );
  const handleCoachCodeChange = (idx, code) => setCoaches(prev =>
    prev.map((coach, i) => i === idx ? { ...coach, code } : coach)
  );
  const handleEditCoach = idx => setCoaches(prev => prev.map((coach, i) => i === idx ? { ...coach, isEditing: true } : coach));
  const handleCoachFareChange = (idx, fare_per_km) => setCoaches(prev =>
    prev.map((coach, i) => i === idx ? { ...coach, fare_per_km } : coach)
  );
  const handleAddSeatType = coachIdx => setCoaches(prev =>
    prev.map((coach, i) => {
      if (i !== coachIdx) return coach;
      const seatTypeId = coach.seatTypeToAdd;
      if (!seatTypeId || coach.seat_types.find(st => st.seat_type_id === seatTypeId)) return coach;
      return {
        ...coach,
        seat_types: [...coach.seat_types, { seat_type_id: seatTypeId, seat_count: "0" }],
        seatTypeToAdd: "",
      };
    })
  );
  const handleRemoveSeatType = (coachIdx, seatTypeId) => setCoaches(prev =>
    prev.map((coach, i) =>
      i === coachIdx
        ? { ...coach, seat_types: coach.seat_types.filter(s => s.seat_type_id !== seatTypeId) }
        : coach
    )
  );
  const handleSeatCountChange = (coachIdx, seatIdx, seat_count) => setCoaches(prev =>
    prev.map((coach, i) =>
      i === coachIdx
        ? { ...coach, seat_types: coach.seat_types.map((seat, j) => j === seatIdx ? { ...seat, seat_count } : seat) }
        : coach
    )
  );
  const handleSeatTypeDropdown = (coachIdx, seatTypeToAdd) => setCoaches(prev =>
    prev.map((coach, i) => i === coachIdx ? { ...coach, seatTypeToAdd } : coach)
  );
  const handleSaveCoach = idx => setCoaches(prev =>
    prev.map((coach, i) => i === idx ? { ...coach, isEditing: false } : coach)
  );

  // --- Validation ---
  const coachCodes = coaches.map(c => (c.code || "").trim().toLowerCase()).filter(Boolean);
  const hasCoachCodeDuplicates = new Set(coachCodes).size !== coachCodes.length;
  function hasSeatNumberDuplicates(coach) {
    let seatNumber = 1;
    const numbers = coach.seat_types.flatMap((seat) =>
      Array.from({ length: Number(seat.seat_count) }, () => seatNumber++)
    );
    return new Set(numbers).size !== numbers.length;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    if (!name.trim() || !code.trim()) {
      setError("Train name and code are required.");
      setSaving(false);
      return;
    }
    if (hasCoachCodeDuplicates) {
      setError("Coach codes must not be duplicated.");
      setSaving(false);
      return;
    }
    if (!coaches.length) {
      setError("Add at least one coach.");
      setSaving(false);
      return;
    }
    for (const coach of coaches) {
      if (!coach.code || !coach.coach_type_id) {
        setError("Please select a coach type and provide a code for every coach.");
        setSaving(false);
        return;
      }
      if (!coach.fare_per_km || isNaN(Number(coach.fare_per_km))) {
        setError("Fare per km must be a number for every coach.");
        setSaving(false);
        return;
      }
      if (!coach.seat_types.length) {
        setError("Please add at least one seat type for every coach.");
        setSaving(false);
        return;
      }
      for (const seat of coach.seat_types) {
        if (
          seat.seat_count === "" ||
          isNaN(Number(seat.seat_count)) ||
          Number(seat.seat_count) < 1
        ) {
          setError("Seat counts must be numbers (at least 1) for all seat types.");
          setSaving(false);
          return;
        }
      }
      if (hasSeatNumberDuplicates(coach)) {
        setError("Seat numbers within a coach must not be duplicated.");
        setSaving(false);
        return;
      }
    }
    const payload = {
      name,
      code,
      coaches: coaches.map(coach => {
        let seatNumber = 1;
        const seats = coach.seat_types.flatMap(seat =>
          Array.from({ length: Number(seat.seat_count) }, () => ({
            seat_type_id: seat.seat_type_id,
            seat_number: seatNumber++,
          }))
        );
        return {
          code: coach.code,
          coach_type_id: coach.coach_type_id,
          fare_per_km: Number(coach.fare_per_km),
          seats,
        };
      }),
    };
    try {
      await trainAdminService.updateTrain(trainId, payload);
      navigate({ to: "/admin/trains/$trainId/view", params: { trainId } });
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to update train.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-lg">Loading...</div>;
  if (error) return <div className="p-8 text-lg text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Edit Train</h2>
        <button
          className="btn btn-outline"
          onClick={() => navigate({ to: "/admin/trains/$trainId/view", params: { trainId } })}
        >
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Train Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <input
          type="text"
          placeholder="Train Code"
          value={code}
          onChange={e => setCode(e.target.value)}
          className="input input-bordered w-full"
          required
        />
        <div>
          <button
            type="button"
            className="btn btn-outline btn-sm mb-2"
            onClick={handleAddCoach}
          >
            + Add Coach
          </button>
        </div>
        {coaches.map((coach, idx) => (
          <div className="rounded-lg p-4 mb-2 border" key={idx}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Coach {idx + 1}</span>
              <button
                type="button"
                className="btn btn-ghost btn-xs text-red-600"
                onClick={() => handleRemoveCoach(idx)}
              >
                Remove
              </button>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Coach Type:</label>
              <select
                className="select select-bordered w-full"
                value={coach.coach_type_id}
                onChange={e => handleCoachTypeChange(idx, e.target.value)}
                disabled={!coach.isEditing ? true : false}
                required
              >
                <option value="">-- Select Coach Type --</option>
                {coachTypes.map(ct => (
                  <option key={ct.id} value={ct.id}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1">Coach Code:</label>
              <input
                type="text"
                placeholder="Coach Code"
                className="input input-bordered w-full"
                value={coach.code}
                onChange={e => handleCoachCodeChange(idx, e.target.value)}
                disabled={!coach.isEditing ? true : false}
                required
              />
            </div>
            {coach.coach_type_id && coach.isEditing && (
              <>
                <div className="mb-2">
                  <label className="block mb-1">Fare per km:</label>
                  <input
                    type="number"
                    min="0"
                    className="input input-bordered w-full"
                    value={coach.fare_per_km}
                    onChange={e =>
                      handleCoachFareChange(idx, e.target.value)
                    }
                    required
                  />
                </div>
                <div className="mb-2 flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block mb-1">Add Seat Type:</label>
                    <select
                      className="select select-bordered w-full"
                      value={coach.seatTypeToAdd || ""}
                      onChange={e => handleSeatTypeDropdown(idx, e.target.value)}
                    >
                      <option value="">-- Select Seat Type --</option>
                      {seatTypes
                        .filter(
                          st =>
                            !coach.seat_types.find(s => s.seat_type_id === st.id)
                        )
                        .map(st => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    className="btn btn-xs btn-outline"
                    onClick={() => handleAddSeatType(idx)}
                    disabled={!coach.seatTypeToAdd}
                  >
                    Add
                  </button>
                </div>
                <div>
                  <label className="block mb-1">Seat Counts:</label>
                  {coach.seat_types.map((seat, seatIdx) => {
                    const seatType = seatTypes.find(
                      st => st.id === seat.seat_type_id
                    );
                    return (
                      <div className="flex items-center mb-2" key={seat.seat_type_id}>
                        <span className="w-32">{seatType ? seatType.name : "Seat"}:</span>
                        <input
                          type="number"
                          min="1"
                          className="input input-bordered w-32"
                          value={seat.seat_count}
                          onChange={e =>
                            handleSeatCountChange(idx, seatIdx, e.target.value)
                          }
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-xs btn-error ml-2"
                          onClick={() =>
                            handleRemoveSeatType(idx, seat.seat_type_id)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="btn btn-xs btn-success mt-2"
                  onClick={() => handleSaveCoach(idx)}
                >
                  Save Coach
                </button>
              </>
            )}
            {coach.coach_type_id && !coach.isEditing && (
              <div className="mt-2">
                <div>
                  <span className="font-bold">Coach Code:</span> {coach.code}
                </div>
                <div>
                  <span className="font-bold">Fare per km:</span> {coach.fare_per_km}
                </div>
                <div className="mt-1">
                  <span className="font-bold">Seats:</span>
                  <ul>
                    {coach.seat_types.map(seat => {
                      const seatType = seatTypes.find(
                        st => st.id === seat.seat_type_id
                      );
                      return (
                        <li key={seat.seat_type_id}>
                          {seatType ? seatType.name : "Seat"}: {seat.seat_count}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <button
                  type="button"
                  className="btn btn-xs btn-outline mt-2"
                  onClick={() => handleEditCoach(idx)}
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={saving}
        >
          {saving ? "Saving..." : "Update Train"}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </div>
  );
}