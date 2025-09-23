import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { addStation, updateStation } from "../services/stationService";
import { useStationById } from "../hooks/useStations";

export default function StationForm({ isEditing, stationId }) {
  const navigate = useNavigate();
  const { data: station, isLoading } = useStationById(stationId);
  const [formData, setFormData] = useState({ name: "", code: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (station) setFormData(station);
  }, [station]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) await updateStation(stationId, formData);
      else await addStation(formData);
      navigate({ to: "/admin/stations" });
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <p className="text-center p-8">
        <span className="loading loading-spinner loading-lg"></span> Loading form...
      </p>
    );
  }

  return (
    <div className="flex justify-center p-6">
      <form className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold">{isEditing ? "Edit Station" : "Add New Station"}</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label className="block font-semibold mb-1">Station Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Station Code</label>
          <input
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="flex justify-between">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" type="submit">
            {isEditing ? "Update" : "Add"}
          </button>
          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => navigate({ to: "/admin/stations" })}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
