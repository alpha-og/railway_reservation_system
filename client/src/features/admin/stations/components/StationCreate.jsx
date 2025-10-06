import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import stationService from "../services/stationService.js";

export default function StationCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", code: "", city: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [allStations, setAllStations] = useState([]);
  const [distances, setDistances] = useState({}); // {toStationId: distance}

  useEffect(() => {
    stationService.getAllStations().then((resp) => {
      const stations = resp.stations || resp.data?.stations || [];
      setAllStations(stations);
    });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    setActionMessage("");
  }

  function handleDistanceChange(toStationId, value) {
    setDistances(prev => ({
      ...prev,
      [toStationId]: value,
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
      const response = await stationService.createStation(submitData);
      const newStationId = response.data?.station?.id || response.station?.id;
      if (response.success && newStationId) {
        // Add distances
        const distancePromises = Object.entries(distances)
          .filter(([toStationId, dist]) => toStationId && dist && !isNaN(dist) && Number(dist) > 0)
          .map(([toStationId, dist]) =>
            stationService.createStationDistance(newStationId, toStationId, Number(dist))
          );
        await Promise.all(distancePromises);
        setActionMessage("✅ Station created successfully!");
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

  return (
    <div className="min-h-screen bg-[#191922] py-12">
      <div className="mb-8 max-w-2xl mx-auto px-4">
        <button onClick={() => navigate({ to: "/admin/stations" })}
          className="text-yellow-400 hover:text-yellow-300 mb-4 flex items-center gap-2 font-semibold">
          ← Back to Stations
        </button>
        <h1 className="text-4xl font-bold text-yellow-100">Add New Station</h1>
        <p className="text-yellow-400 mt-2">Fill in the details to create a new station</p>
      </div>

      <Card className="p-10 max-w-2xl mx-auto rounded-2xl shadow-lg bg-[#23232e] text-yellow-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-base font-semibold text-yellow-400 mb-2">
              Station Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., New Delhi Railway Station"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg bg-[#191922] text-yellow-100 ${errors.name ? "border-red-500" : "border-yellow-700"}`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            <p className="mt-1 text-xs text-yellow-400">Full official station name (2-100 characters)</p>
          </div>
          <div>
            <label className="block text-base font-semibold text-yellow-400 mb-2">
              Station Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., NDLS"
              maxLength={10}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent uppercase text-lg bg-[#191922] text-yellow-100 ${errors.code ? "border-red-500" : "border-yellow-700"}`}
            />
            {errors.code && <p className="mt-1 text-sm text-red-400">{errors.code}</p>}
            <p className="mt-1 text-xs text-yellow-400">Unique code (1-10 chars, letters and numbers only)</p>
          </div>
          <div>
            <label className="block text-base font-semibold text-yellow-400 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., New Delhi"
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg bg-[#191922] text-yellow-100 ${errors.city ? "border-red-500" : "border-yellow-700"}`}
            />
            {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city}</p>}
            <p className="mt-1 text-xs text-yellow-400">City where the station is located (2-50 characters)</p>
          </div>
          <div>
            <label className="block text-base font-semibold text-yellow-400 mb-2">
              Distances <span className="text-yellow-300">(from this station)</span>
            </label>
            <div className="space-y-2">
              {allStations.map(st => (
                <div key={st.id} className="flex items-center gap-3">
                  <span className="w-32 text-yellow-200">{st.name} ({st.code})</span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={distances[st.id] || ""}
                    placeholder="Distance (km)"
                    className="w-32 px-2 py-1 border border-yellow-800 rounded bg-[#191922] text-yellow-100"
                    onChange={e => handleDistanceChange(st.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <p className="mt-1 text-xs text-yellow-400">Leave blank to not set a distance.</p>
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
                  Creating...
                </span>
              ) : (
                <span>➕ Create Station</span>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}