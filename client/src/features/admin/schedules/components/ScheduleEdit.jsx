import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import { getScheduleById, updateSchedule } from "../services/scheduleService.js";
import stationService from "../../../admin/stations/services/stationService.js";
import trainService from "../../../admin/trains/services/trainAdmin.service.js";

export default function ScheduleEdit({ scheduleId }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    trainId: "",
    departureDate: "",
    departureTime: "",
  });
  const [scheduleStops, setScheduleStops] = useState([]);
  const [errors, setErrors] = useState({});
  const [actionMessage, setActionMessage] = useState("");
  const [allStations, setAllStations] = useState([]);
  const [allTrains, setAllTrains] = useState([]);

  useEffect(() => {
    async function fetchAll() {
      try {
        // Get schedule, stations, and trains
        const [schedResp, stationsResp, trainsResp] = await Promise.all([
          getScheduleById(scheduleId),
          stationService.getAllStations(),
          trainService.getTrains(),
        ]);
        // Debug API responses
        console.log("DEBUG scheduleResp:", schedResp);
        console.log("DEBUG stationsResp:", stationsResp);
        console.log("DEBUG trainsResp:", trainsResp);

        // Extract schedule data
        const schedule =
          schedResp.data?.schedule ||
          schedResp.schedule ||
          schedResp.data ||
          schedResp;

        setFormData({
          trainId: schedule.train_id,
          departureDate: schedule.departure_date,
          departureTime: schedule.departure_time,
        });

        // Extract stops, prefill using station object if present
        setScheduleStops(
          (schedule.schedule_stops || []).map((stop) => ({
            stationId: stop.station?.id || stop.station_id,
            stopNumber: stop.stop_number,
            arrivalTime: stop.arrival_time,
            departureTime: stop.departure_time,
          }))
        );

        setAllStations(stationsResp.stations || stationsResp.data?.stations || []);
        setAllTrains(trainsResp.data?.trains || trainsResp.trains || trainsResp || []);
      } catch {
        setActionMessage("❌ Could not load schedule.");
      }
    }
    if (scheduleId) fetchAll();
  }, [scheduleId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setActionMessage("");
  };

  const handleStopChange = (idx, field, value) => {
    setScheduleStops((prev) =>
      prev.map((stop, i) =>
        i === idx ? { ...stop, [field]: value } : stop
      )
    );
  };

  const addStop = () => {
    setScheduleStops((prev) => [
      ...prev,
      {
        stationId: "",
        stopNumber: prev.length + 1,
        arrivalTime: "",
        departureTime: "",
      },
    ]);
  };

  const removeStop = (idx) => {
    setScheduleStops((prev) =>
      prev.filter((_, i) => i !== idx).map((stop, i) => ({
        ...stop,
        stopNumber: i + 1,
      }))
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.trainId) newErrors.trainId = "Select a train";
    if (!formData.departureDate) newErrors.departureDate = "Pick a date";
    if (!formData.departureTime) newErrors.departureTime = "Pick a time";
    if (scheduleStops.length === 0) newErrors.scheduleStops = "Add at least one stop";
    scheduleStops.forEach((stop, idx) => {
      if (!stop.stationId) newErrors[`stop${idx}_stationId`] = "Pick station";
      if (!stop.arrivalTime) newErrors[`stop${idx}_arrivalTime`] = "Arrival required";
      if (!stop.departureTime) newErrors[`stop${idx}_departureTime`] = "Departure required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionMessage("");
    if (!validateForm()) return;
    try {
      const response = await updateSchedule(scheduleId, {
        trainId: formData.trainId,
        departureDate: formData.departureDate,
        departureTime: formData.departureTime,
        scheduleStops,
      });
      console.log("DEBUG update response:", response);
      if (response.success) {
        setActionMessage("✅ Schedule updated!");
        setTimeout(() => navigate({ to: "/admin/schedules" }), 1200);
      } else {
        setActionMessage("❌ Could not update schedule.");
      }
    } catch (err) {
      setActionMessage("❌ " + (err.message || "Error occurred"));
    }
  };

  return (
    <div className="min-h-screen bg-[#191922] py-12">
      <div className="mb-8 max-w-2xl mx-auto px-4">
        <button onClick={() => navigate({ to: "/admin/schedules" })}
          className="text-yellow-400 hover:text-yellow-300 mb-4 flex items-center gap-2 font-semibold">
          ← Back to Schedules
        </button>
        <h1 className="text-4xl font-bold text-yellow-100">Edit Schedule</h1>
      </div>
      <Card className="p-10 max-w-2xl mx-auto rounded-2xl shadow-lg bg-[#23232e] text-yellow-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block font-semibold text-yellow-400 mb-2">Train</label>
            <select name="trainId" value={formData.trainId} onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl bg-[#191922] text-yellow-100">
              <option value="">Select Train</option>
              {allTrains.map(train => (
                <option key={train.id} value={train.id}>
                  {train.name} ({train.code})
                </option>
              ))}
            </select>
            {errors.trainId && <p className="mt-1 text-sm text-red-400">{errors.trainId}</p>}
          </div>
          <div>
            <label className="block font-semibold text-yellow-400 mb-2">Departure Date</label>
            <input type="date" name="departureDate" value={formData.departureDate}
              onChange={handleChange} className="w-full px-4 py-3 border rounded-xl bg-[#191922] text-yellow-100" />
            {errors.departureDate && <p className="mt-1 text-sm text-red-400">{errors.departureDate}</p>}
          </div>
          <div>
            <label className="block font-semibold text-yellow-400 mb-2">Departure Time</label>
            <input type="time" name="departureTime" value={formData.departureTime}
              onChange={handleChange} className="w-full px-4 py-3 border rounded-xl bg-[#191922] text-yellow-100" />
            {errors.departureTime && <p className="mt-1 text-sm text-red-400">{errors.departureTime}</p>}
          </div>
          <div>
            <label className="block font-semibold text-yellow-400 mb-2">Schedule Stops</label>
            {scheduleStops.map((stop, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <span className="text-yellow-300">#{stop.stopNumber}</span>
                <select value={stop.stationId} onChange={e => handleStopChange(idx, "stationId", e.target.value)}
                  className="px-2 py-1 border rounded bg-[#191922] text-yellow-100">
                  <option value="">Station</option>
                  {allStations.map(st => (
                    <option key={st.id} value={st.id}>{st.name} ({st.code})</option>
                  ))}
                </select>
                <input type="time" value={stop.arrivalTime}
                  onChange={e => handleStopChange(idx, "arrivalTime", e.target.value)}
                  className="px-2 py-1 w-28 border rounded bg-[#191922] text-yellow-100"
                  placeholder="Arrival" />
                <input type="time" value={stop.departureTime}
                  onChange={e => handleStopChange(idx, "departureTime", e.target.value)}
                  className="px-2 py-1 w-28 border rounded bg-[#191922] text-yellow-100"
                  placeholder="Departure" />
                <Button type="button" className="bg-red-700" onClick={() => removeStop(idx)}>-</Button>
                {errors[`stop${idx}_stationId`] && <span className="text-xs text-red-400">{errors[`stop${idx}_stationId`]}</span>}
                {errors[`stop${idx}_arrivalTime`] && <span className="text-xs text-red-400">{errors[`stop${idx}_arrivalTime`]}</span>}
                {errors[`stop${idx}_departureTime`] && <span className="text-xs text-red-400">{errors[`stop${idx}_departureTime`]}</span>}
              </div>
            ))}
            <Button type="button" className="bg-green-700" onClick={addStop}>+ Add Stop</Button>
            {errors.scheduleStops && <p className="mt-1 text-sm text-red-400">{errors.scheduleStops}</p>}
          </div>
          {actionMessage && (
            <div className={`py-2 text-center rounded-lg font-semibold ${actionMessage.startsWith("✅") ? "text-green-400 bg-green-950" : "text-red-400 bg-red-950"}`}>
              {actionMessage}
            </div>
          )}
          <div className="flex gap-4 pt-6">
            <Button type="button" onClick={() => navigate({ to: "/admin/schedules" })} className="flex-1 bg-[#1a1a23] hover:bg-yellow-900 text-yellow-200 rounded-lg shadow">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-yellow-700 hover:bg-yellow-800 text-yellow-50 rounded-lg shadow">
              Update Schedule
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}