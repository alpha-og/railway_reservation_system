import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import stationService from "../services/stationService.js";

export default function StationEdit({ stationId }) {
  const navigate = useNavigate();
  const isEdit = Boolean(stationId);

  const [formData, setFormData] = useState({ name: "", code: "", city: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [fetchError, setFetchError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [allStations, setAllStations] = useState([]);
  const [distances, setDistances] = useState({}); // { toStationId: { id, distance } }

  useEffect(() => {
    async function fetchAll() {
      setFetchLoading(true);
      setFetchError("");
      try {
        const [stationResp, stationsResp, distancesResp] = await Promise.all([
          stationService.getStationById(stationId),
          stationService.getAllStations(),
          stationService.getStationDistances(stationId),
        ]);
        const station =
          stationResp?.station ||
          stationResp?.data?.station ||
          (stationResp?.success && stationResp?.data?.station);
        setFormData({
          name: station?.name || "",
          code: station?.code || "",
          city: station?.city || "",
        });
        setAllStations(stationsResp.stations || stationsResp.data?.stations || []);
        const distMap = {};
        for (const d of distancesResp.distances || []) {
          distMap[d.to_station_id] = { id: d.id, distance: d.distance };
        }
        setDistances(distMap);
      } catch (error) {
        setFetchError(error.message || "Failed to fetch station data");
        setFormData({ name: "", code: "", city: "" });
      } finally {
        setFetchLoading(false);
      }
    }
    if (isEdit && stationId) fetchAll();
  }, [isEdit, stationId]);

  function _handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setActionMessage("");
  }

  function handleDistanceChange(toStationId, value) {
    setDistances(prev => ({
      ...prev,
      [toStationId]: {
        ...prev[toStationId],
        distance: value,
      },
    }));
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Station name is required";
    else if (formData.name.length < 2) newErrors.name = "Station name must be at least 2 characters";
    else if (formData.name.length > 100) newErrors.name = "Station name must not exceed 100 characters";
    if (!formData.code.trim()) newErrors.code = "Station code is required";
    else if (formData.code.length < 1) newErrors.code = "Station code must be at least 1 character";
    else if (formData.code.length > 10) newErrors.code = "Station code must not exceed 10 characters";
    else if (!/^[A-Z0-9]+$/.test(formData.code.toUpperCase())) newErrors.code = "Station code must contain only letters and numbers";
    if (!formData.city.trim()) newErrors.city = "City is required";
    else if (formData.city.length < 2) newErrors.city = "City name must be at least 2 characters";
    else if (formData.city.length > 50) newErrors.city = "City name must not exceed 50 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setActionMessage("");
    if (!validateForm()) return;
    try {
      setLoading(true);
      const submitData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        city: formData.city.trim(),
      };
      const response = await stationService.updateStation(stationId, submitData);
      if (response.success) {
        // Update distances
        const distanceOps = [];
        for (const st of allStations) {
          if (st.id === stationId) continue;
          const distVal = distances[st.id]?.distance;
          const distId = distances[st.id]?.id;
          if (distVal && !isNaN(distVal) && Number(distVal) > 0) {
            if (distId) {
              // Update existing
              distanceOps.push(stationService.updateStationDistance(distId, Number(distVal)));
            } else {
              // Create new
              distanceOps.push(stationService.createStationDistance(stationId, st.id, Number(distVal)));
            }
          } else if (distId && (!distVal || Number(distVal) === 0)) {
            // Delete if removed
            distanceOps.push(stationService.deleteStationDistance(distId));
          }
        }
        await Promise.all(distanceOps);
        setActionMessage("✅ Station updated successfully!");
        setTimeout(() => navigate({ to: "/admin/stations" }), 1200);
      } else {
        setActionMessage("❌ An error occurred. Try again.");
      }
    } catch (error) {
      setActionMessage("❌ " + (error.message || "An error occurred"));
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#191922]">
        <Card className="p-10 max-w-lg mx-auto rounded-2xl shadow-lg bg-[#23232e] text-yellow-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-yellow-600 mx-auto mb-6"></div>
            <h2 className="text-xl font-bold text-yellow-400 mb-2">Loading station data...</h2>
          </div>
        </Card>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#191922]">
        <Card className="p-10 max-w-lg mx-auto rounded-2xl shadow-lg bg-[#23232e] text-center text-yellow-100">
          <h2 className="text-2xl font-bold mb-4 text-red-400">Error Loading Station</h2>
          <div className="mb-6 text-yellow-200">{fetchError}</div>
          <Button
            onClick={() => navigate({ to: "/admin/stations" })}
            className="bg-yellow-600 text-yellow-50 px-4 py-2 rounded-lg shadow hover:bg-yellow-700"
          >
            Back to Stations
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191922] py-12">
      <div className="mb-8 max-w-2xl mx-auto px-4">
        <button onClick={() => navigate({ to: "/admin/stations" })}
          className="text-yellow-400 hover:text-yellow-300 mb-4 flex items-center gap-2 font-semibold">
          ← Back to Stations
        </button>
        <h1 className="text-4xl font-bold text-yellow-100">Edit Station</h1>
        <p className="text-yellow-400 mt-2">Update station information below</p>
      </div>

      <Card className="p-10 max-w-2xl mx-auto rounded-2xl shadow-lg bg-[#23232e] text-yellow-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-base font-semibold text-yellow-400 mb-2">
              Distances to Other Stations
            </label>
            <div className="space-y-2">
              {allStations
                .filter(s => s.id !== stationId)
                .map(st => (
                <div key={st.id} className="flex items-center gap-3">
                  <span className="w-32 text-yellow-200">{st.name} ({st.code})</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={distances[st.id]?.distance || ""}
                    placeholder="Distance (km)"
                    className="w-32 px-2 py-1 border border-yellow-800 rounded bg-[#191922] text-yellow-100"
                    onChange={e => handleDistanceChange(st.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <p className="mt-1 text-xs text-yellow-400">Leave blank or zero to remove a distance.</p>
          </div>
          {actionMessage && (
            <div className={`py-2 text-center rounded-lg font-semibold ${actionMessage.startsWith("✅") ? "text-green-400 bg-green-950" : "text-red-400 bg-red-950"}`}>
              {actionMessage}
            </div>
          )}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              onClick={() => navigate({ to: "/admin/stations" })}
              className="flex-1 bg-[#1a1a23] hover:bg-yellow-900 text-yellow-200 rounded-lg shadow"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-yellow-700 hover:bg-yellow-800 text-yellow-50 rounded-lg shadow" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-50"></div>
                  Updating...
                </span>
              ) : (
                <span>💾 Update Station</span>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}