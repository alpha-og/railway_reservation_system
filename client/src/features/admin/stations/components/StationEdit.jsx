import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  MapPin, 
  Code, 
  Building2, 
  Route, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle,
  Sparkles,
  Edit3
} from "lucide-react";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import { FormField, Input } from "../../../../components/ui/index.js";
import { PageLoadingSkeleton } from "../../../../components/LoadingSkeleton.jsx";
import stationService from "../services/stationService.js";

export default function StationEdit({ stationId }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", code: "", city: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [allStations, setAllStations] = useState([]);
  const [distances, setDistances] = useState({});

  useEffect(() => {
    async function fetchAll() {
      setFetchLoading(true);
      setFetchError("");
      try {
        const [stationResp, stationsResp, distancesResp] = await Promise.all([
          stationService.getStationById(stationId),
          stationService.getAllStations(),
          stationService.getStationDistances(),
        ]);

        const station = stationResp?.station || stationResp?.data?.station || 
                      (stationResp?.success && stationResp?.data?.station);
        
        setFormData({
          name: station?.name || "",
          code: station?.code || "",
          city: station?.city || "",
        });

        const stationsArr = stationsResp?.stations || stationsResp?.data?.stations || [];
        setAllStations(stationsArr);

        const distancesArr = distancesResp?.distances || distancesResp?.data?.distances || [];
        const distMap = {};
        for (const d of distancesArr) {
          if (String(d.from_station_id) === String(stationId)) {
            distMap[d.to_station_id] = { id: d.id, distance: d.distance };
          }
        }
        setDistances(distMap);
      } catch (error) {
        setFetchError(error.message || "Failed to fetch station data");
        setFormData({ name: "", code: "", city: "" });
      } finally {
        setFetchLoading(false);
      }
    }
    if (stationId) fetchAll();
  }, [stationId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
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
        // Handle distance operations
        const distanceOps = [];
        for (const st of allStations) {
          if (String(st.id) === String(stationId)) continue;
          const toStationId = st.id;
          const distVal = distances[toStationId]?.distance;
          const distId = distances[toStationId]?.id;
          
          if (distVal && !isNaN(distVal) && Number(distVal) > 0) {
            if (distId) {
              distanceOps.push(stationService.updateStationDistance(distId, Number(distVal)));
            } else {
              distanceOps.push(stationService.createStationDistance(stationId, toStationId, Number(distVal)));
            }
          } else if (distId && (!distVal || Number(distVal) === 0)) {
            distanceOps.push(stationService.deleteStationDistance(distId));
          }
        }
        
        await Promise.all(distanceOps);
        setActionMessage("Station updated successfully!");
        setTimeout(() => navigate({ to: "/admin/stations" }), 1500);
      } else {
        setActionMessage("Failed to update station. Please try again.");
      }
    } catch (error) {
      setActionMessage(error.message || "An error occurred while updating the station.");
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return <PageLoadingSkeleton />;
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="max-w-lg mx-auto bg-white/5 backdrop-blur-sm border-white/10">
          <div className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-bold mb-4 text-white">Error Loading Station</h2>
            <p className="text-slate-400 mb-6">{fetchError}</p>
            <Button
              onClick={() => navigate({ to: "/admin/stations" })}
              variant="primary"
            >
              Back to Stations
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
          <motion.button 
            onClick={() => navigate({ to: "/admin/stations" })}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4 group"
            whileHover={{ x: -4 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Stations
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Edit3 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Edit Station</h1>
              <p className="text-slate-400">Update station information and distances</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Action Message */}
        {actionMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
              actionMessage.includes("success") 
                ? "bg-green-500/10 border-green-500/20 text-green-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {actionMessage.includes("success") ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {actionMessage}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm border-white/10">
            <form onSubmit={handleSubmit} className="space-y-8 p-8">
              {/* Basic Information */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Basic Information</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <FormField label="Station Name" error={errors.name} required>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., New Delhi Railway Station"
                        className="pl-10"
                        variant={errors.name ? "error" : "bordered"}
                      />
                    </div>
                  </FormField>

                  <FormField label="Station Code" error={errors.code} required>
                    <div className="relative">
                      <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="e.g., NDLS"
                        maxLength={10}
                        className="pl-10 uppercase"
                        variant={errors.code ? "error" : "bordered"}
                      />
                    </div>
                  </FormField>

                  <FormField label="City" error={errors.city} required>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g., New Delhi"
                        className="pl-10"
                        variant={errors.city ? "error" : "bordered"}
                      />
                    </div>
                  </FormField>
                </div>
              </div>

              {/* Distance Configuration */}
              <div className="divider"></div>
              
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Route className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Distance Configuration</h2>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <p className="text-slate-400 text-sm mb-4">
                    Update distances from this station to other stations
                  </p>
                  {allStations
                    .filter(st => String(st.id) !== String(stationId))
                    .map(station => (
                      <div key={station.id} className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium text-white">{station.name}</div>
                          <div className="text-sm text-slate-400">Code: {station.code} • City: {station.city}</div>
                        </div>
                        <div className="w-32">
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={distances[station.id]?.distance ?? ""}
                            placeholder="Distance (km)"
                            onChange={(e) => handleDistanceChange(station.id, e.target.value)}
                            size="sm"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="divider"></div>
              
              <Card.Actions justify="end" className="gap-4">
                <Button 
                  type="button" 
                  onClick={() => navigate({ to: "/admin/stations" })} 
                  variant="ghost"
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  variant="primary"
                  loading={loading}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Updating..." : "Update Station"}
                </Button>
              </Card.Actions>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}