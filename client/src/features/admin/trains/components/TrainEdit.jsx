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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

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

        setCoaches((train.coaches || []).map((coach) => {
          // Group seats by seat type label (prefer seat_type_name if present)
          const seatTypeMap = {};
          (coach.seats || []).forEach(seat => {
            const seatTypeLabel = seat.seat_type_name
              || (seatTypesRes.find(st => String(st.id) === String(seat.seat_type_id))?.name)
              || seat.seat_type_id
              || "Unknown Seat Type";
            const seatTypeId = seat.seat_type_id
              || (seatTypesRes.find(st => st.name === seatTypeLabel)?.id)
              || seatTypeLabel;
            if (!seatTypeMap[seatTypeId]) {
              seatTypeMap[seatTypeId] = { seat_type_id: seatTypeId, seat_type_label: seatTypeLabel, seat_count: 0 };
            }
            seatTypeMap[seatTypeId].seat_count += 1;
          });

          return {
            code: coach.code,
            coach_type_id: coach.coach_type_id
              || (coachTypesRes.find(ct => ct.name === coach.coach_type_name)?.id)
              || "",
            coach_type_name: coach.coach_type_name
              || (coachTypesRes.find(ct => ct.id === coach.coach_type_id)?.name)
              || "",
            seat_types: Object.values(seatTypeMap), // [{ seat_type_id, seat_type_label, seat_count }]
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

  const handleAddCoach = () => setCoaches(prev => [
    ...prev,
    {
      code: "",
      coach_type_id: "",
      coach_type_name: "",
      seat_types: [],
      seatTypeToAdd: "",
      isEditing: true,
    },
  ]);
  const handleRemoveCoach = idx => setCoaches(prev => prev.filter((_, i) => i !== idx));
  const handleCoachTypeChange = (idx, coach_type_id) => setCoaches(prev =>
    prev.map((coach, i) => {
      const coachTypeObj = coachTypes.find(ct => String(ct.id) === String(coach_type_id));
      return i === idx
        ? {
          ...coach,
          coach_type_id,
          coach_type_name: coachTypeObj?.name || "",
          seat_types: [],
          seatTypeToAdd: "",
          isEditing: true
        }
        : coach;
    })
  );
  const handleCoachCodeChange = (idx, code) => setCoaches(prev =>
    prev.map((coach, i) => i === idx ? { ...coach, code } : coach)
  );
  const handleEditCoach = idx => setCoaches(prev => prev.map((coach, i) => i === idx ? { ...coach, isEditing: true } : coach));
  const handleAddSeatType = coachIdx => setCoaches(prev =>
    prev.map((coach, i) => {
      if (i !== coachIdx) return coach;
      const seatTypeId = coach.seatTypeToAdd;
      const seatTypeObj = seatTypes.find(st => String(st.id) === String(seatTypeId));
      const seatTypeLabel = seatTypeObj?.name || seatTypeId;
      if (!seatTypeId || coach.seat_types.find(st => st.seat_type_id === seatTypeId)) return coach;
      return {
        ...coach,
        seat_types: [
          ...coach.seat_types,
          { seat_type_id: seatTypeId, seat_type_label: seatTypeLabel, seat_count: "1" }
        ],
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
    setSuccess(false);
    setSaving(true);
    if (!name.trim()) {
      setError("Train name is required.");
      setSaving(false);
      return;
    }
    if (!code.trim()) {
      setError("Train code is required.");
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
        setError("Select a coach type and provide a code for every coach.");
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
      coaches: coaches.map((coach) => {
        let seatNumber = 1;
        const seats = coach.seat_types.flatMap((seat) =>
          Array.from({ length: Number(seat.seat_count) }, () => ({
            seat_type_id: seat.seat_type_id,
            seat_number: seatNumber++,
          }))
        );
        return {
          code: coach.code,
          coach_type_id: coach.coach_type_id,
          seats,
        };
      }),
    };
    try {
      await trainAdminService.updateTrain(trainId, payload);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/admin/trains/$trainId/view", params: { trainId } });
      }, 1200);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to update train.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-lg text-yellow-200">Loading...</div>;
  if (error) return <div className="p-8 text-lg text-red-400">{error}</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-[#21212b] text-yellow-100 rounded-2xl shadow-lg border border-yellow-900">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-yellow-200">Edit Train</h2>
        <button
          className="btn btn-outline border-yellow-600 text-yellow-300 hover:bg-yellow-900 hover:text-yellow-50"
          onClick={() => navigate({ to: "/admin/trains/$trainId/view", params: { trainId } })}
        >
          Cancel
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Train Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="input input-bordered w-full bg-[#2c2c38] border-yellow-800 text-yellow-100 text-lg"
            required
          />
          <input
            type="text"
            placeholder="Train Code"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="input input-bordered w-full bg-[#2c2c38] border-yellow-800 text-yellow-100 text-lg"
            required
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-xl text-yellow-400 tracking-wide">Coaches</h3>
            <button
              type="button"
              className="btn btn-outline btn-sm border-yellow-600 text-yellow-300 hover:bg-yellow-900 hover:text-yellow-50"
              onClick={handleAddCoach}
            >+ Add Coach</button>
          </div>
          <div className="space-y-6">
            {coaches.map((coach, idx) => {
              const coachTypeLabel = coach.coach_type_name
                || (coachTypes.find(ct => String(ct.id) === String(coach.coach_type_id))?.name)
                || coach.coach_type_id
                || "";

              return (
                <div className="rounded-xl p-5 border border-yellow-900 bg-[#282836] shadow" key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">
                      Coach {idx + 1}{" "}
                      {coachTypeLabel && <span className="text-yellow-400">({coachTypeLabel})</span>}
                    </span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs text-red-400"
                      onClick={() => handleRemoveCoach(idx)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex gap-4 mb-2">
                    <select
                      className="select select-bordered w-full bg-[#23232e] border-yellow-800 text-yellow-100 text-lg"
                      value={coach.coach_type_id || ""}
                      onChange={e => handleCoachTypeChange(idx, e.target.value)}
                      required
                    >
                      <option value="">-- Select Coach Type --</option>
                      {coachTypes.map(ct => (
                        <option key={ct.id} value={ct.id}>{ct.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Coach Code"
                      className="input input-bordered w-full bg-[#23232e] border-yellow-800 text-yellow-100 text-lg"
                      value={coach.code}
                      onChange={e => handleCoachCodeChange(idx, e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1 text-yellow-300 font-semibold">Seats:</label>
                    {coach.seat_types.map((seat, seatIdx) => (
                      <div className="flex items-center mb-2 gap-2" key={seat.seat_type_id}>
                        <span className="w-40">{seat.seat_type_label || seat.seat_type_id || "Seat"}:</span>
                        <input
                          type="number"
                          min="1"
                          className="input input-bordered w-28 bg-[#23232e] border-yellow-800 text-yellow-100 text-lg"
                          value={seat.seat_count}
                          onChange={e =>
                            handleSeatCountChange(idx, seatIdx, e.target.value)
                          }
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-xs btn-error"
                          onClick={() => handleRemoveSeatType(idx, seat.seat_type_id)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2 items-end mt-2">
                      <select
                        className="select select-bordered w-full bg-[#23232e] border-yellow-800 text-yellow-100 text-lg"
                        value={coach.seatTypeToAdd || ""}
                        onChange={e => handleSeatTypeDropdown(idx, e.target.value)}
                      >
                        <option value="">-- Add Seat Type --</option>
                        {seatTypes
                          .filter(st => !coach.seat_types.find(s => s.seat_type_id === st.id))
                          .map(st => (
                            <option key={st.id} value={st.id}>{st.name}</option>
                          ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-xs btn-outline border-yellow-600 text-yellow-300 hover:bg-yellow-900 hover:text-yellow-50"
                        onClick={() => handleAddSeatType(idx)}
                        disabled={!coach.seatTypeToAdd}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  {coach.isEditing ? (
                    <button
                      type="button"
                      className="btn btn-xs btn-success mt-2"
                      onClick={() => handleSaveCoach(idx)}
                    >
                      Save Coach
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-xs btn-outline mt-2 border-yellow-600 text-yellow-300 hover:bg-yellow-900 hover:text-yellow-50"
                      onClick={() => handleEditCoach(idx)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary w-full bg-yellow-800 text-yellow-100 border-yellow-900 hover:bg-yellow-700"
          disabled={saving}
        >
          {saving ? "Saving..." : "Update Train"}
        </button>
        {success && <p className="text-green-400 mt-2">Train updated successfully!</p>}
        {error && <p className="text-red-400 mt-2">{error}</p>}
      </form>
    </div>
  );
}