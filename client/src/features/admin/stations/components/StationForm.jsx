// client/src/features/admin/stations/components/StationForm.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import Button  from "../../../../components/ui/Button.jsx";
import  Card  from "../../../../components/ui/Card.jsx";
import stationService from "../services/stationService.js";

function StationForm({ stationId = null, isEdit = false }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    city: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && stationId) {
      fetchStationData();
    }
  }, [isEdit, stationId]);

  async function fetchStationData() {
    try {
      setFetchLoading(true);
      const response = await stationService.getStationById(stationId);

      if (response.success) {
        const station = response.data.station;
        setFormData({
          name: station.name || "",
          code: station.code || "",
          city: station.city || "",
        });
      }
    } catch (error) {
      alert(error.message || "Failed to fetch station data");
      navigate({ to: "/admin/stations" });
    } finally {
      setFetchLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Station name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Station name must be at least 2 characters";
    } else if (formData.name.length > 100) {
      newErrors.name = "Station name must not exceed 100 characters";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Station code is required";
    } else if (formData.code.length < 1) {
      newErrors.code = "Station code must be at least 1 character";
    } else if (formData.code.length > 10) {
      newErrors.code = "Station code must not exceed 10 characters";
    } else if (!/^[A-Z0-9]+$/.test(formData.code.toUpperCase())) {
      newErrors.code = "Station code must contain only letters and numbers";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (formData.city.length < 2) {
      newErrors.city = "City name must be at least 2 characters";
    } else if (formData.city.length > 50) {
      newErrors.city = "City name must not exceed 50 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        city: formData.city.trim(),
      };

      let response;
      if (isEdit) {
        response = await stationService.updateStation(stationId, submitData);
      } else {
        response = await stationService.createStation(submitData);
      }

      if (response.success) {
        alert(isEdit ? "Station updated successfully!" : "Station created successfully!");
        navigate({ to: "/admin/stations" });
      }
    } catch (error) {
      if (error.issues) {
        const backendErrors = {};
        error.issues.forEach((issue) => {
          backendErrors[issue.path[0]] = issue.message;
        });
        setErrors(backendErrors);
      } else {
        alert(error.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading station data...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate({ to: "/admin/stations" })} className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2">
          ← Back to Stations
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{isEdit ? "Edit Station" : "Add New Station"}</h1>
        <p className="text-gray-600 mt-1">{isEdit ? "Update station information" : "Fill in the details to create a new station"}</p>
      </div>

      {/* Form Card */}
      <Card className="p-8 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Station Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Station Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., New Delhi Railway Station"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            <p className="mt-1 text-xs text-gray-500">Enter the full name of the station (2-100 characters)</p>
          </div>

          {/* Station Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Station Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., NDLS"
              maxLength={10}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase ${
                errors.code ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code}</p>}
            <p className="mt-1 text-xs text-gray-500">Unique station code (1-10 characters, letters and numbers only)</p>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., New Delhi"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
            <p className="mt-1 text-xs text-gray-500">City where the station is located (2-50 characters)</p>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={() => navigate({ to: "/admin/stations" })}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEdit ? "Updating..." : "Creating..."}
                </span>
              ) : (
                <span>{isEdit ? "💾 Update Station" : "➕ Create Station"}</span>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Help Card */}
      <Card className="p-6 max-w-2xl mx-auto mt-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Station codes are typically 2-5 character abbreviations</li>
          <li>• Use standard railway station codes when possible</li>
          <li>• Station names should be clear and official</li>
          <li>• All fields are required for a valid station entry</li>
        </ul>
      </Card>
    </div>
  );
}

export default StationForm;
