import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Train, 
  Calendar, 
  Clock, 
  MapPin,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Edit3
} from "lucide-react";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import { FormField, Input, Select } from "../../../../components/ui/index.js";
import { PageLoadingSkeleton } from "../../../../components/LoadingSkeleton.jsx";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      setIsLoading(true);
      try {
        const [schedResp, stationsResp, trainsResp] = await Promise.all([
          getScheduleById(scheduleId),
          stationService.getAllStations(),
          trainService.getTrains(),
        ]);

        const schedule = schedResp.data?.schedule || schedResp.schedule || schedResp.data || schedResp;

        setFormData({
          trainId: schedule.train_id,
          departureDate: schedule.departure_date,
          departureTime: schedule.departure_time,
        });

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
        setActionMessage("Failed to load schedule data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    if (scheduleId) fetchAll();
  }, [scheduleId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setActionMessage("");
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleStopChange = (idx, field, value) => {
    setScheduleStops((prev) =>
      prev.map((stop, i) =>
        i === idx ? { ...stop, [field]: value } : stop
      )
    );
    
    const errorKey = `stop${idx}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }));
    }
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
    if (!formData.trainId) newErrors.trainId = "Please select a train";
    if (!formData.departureDate) newErrors.departureDate = "Please select a departure date";
    if (!formData.departureTime) newErrors.departureTime = "Please select a departure time";
    if (scheduleStops.length === 0) newErrors.scheduleStops = "Please add at least one stop";
    
    scheduleStops.forEach((stop, idx) => {
      if (!stop.stationId) newErrors[`stop${idx}_stationId`] = "Required";
      if (!stop.arrivalTime) newErrors[`stop${idx}_arrivalTime`] = "Required";
      if (!stop.departureTime) newErrors[`stop${idx}_departureTime`] = "Required";
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionMessage("");
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await updateSchedule(scheduleId, {
        trainId: formData.trainId,
        departureDate: formData.departureDate,
        departureTime: formData.departureTime,
        scheduleStops,
      });
      
      if (response.success) {
        setActionMessage("Schedule updated successfully!");
        setTimeout(() => navigate({ to: "/admin/schedules" }), 1500);
      } else {
        setActionMessage("Failed to update schedule. Please try again.");
      }
    } catch (err) {
      setActionMessage(err.message || "An error occurred while updating the schedule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
          <motion.button 
            onClick={() => navigate({ to: "/admin/schedules" })}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4 group"
            whileHover={{ x: -4 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Schedules
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
              <h1 className="text-3xl font-bold text-white">Edit Schedule</h1>
              <p className="text-slate-400">Modify train schedule details and stops</p>
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
                  <FormField label="Train" error={errors.trainId} required>
                    <Select 
                      name="trainId" 
                      value={formData.trainId} 
                      onChange={handleChange}
                      options={allTrains.map(train => ({
                        id: train.id,
                        name: `${train.name} (${train.code})`
                      }))}
                      placeholder="Select Train"
                      variant={errors.trainId ? "error" : "bordered"}
                    />
                  </FormField>

                  <FormField label="Departure Date" error={errors.departureDate} required>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        type="date" 
                        name="departureDate" 
                        value={formData.departureDate}
                        onChange={handleChange}
                        variant={errors.departureDate ? "error" : "bordered"}
                        className="pl-10"
                      />
                    </div>
                  </FormField>

                  <FormField label="Departure Time" error={errors.departureTime} required>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input 
                        type="time" 
                        name="departureTime" 
                        value={formData.departureTime}
                        onChange={handleChange}
                        variant={errors.departureTime ? "error" : "bordered"}
                        className="pl-10"
                      />
                    </div>
                  </FormField>
                </div>
              </div>

              {/* Schedule Stops */}
              <div className="divider"></div>
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <h2 className="text-xl font-semibold text-white">Schedule Stops</h2>
                  </div>
                  <Button 
                    type="button" 
                    onClick={addStop}
                    variant="success"
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Stop
                  </Button>
                </div>

                {scheduleStops.length === 0 ? (
                  <div className="text-center py-12 bg-slate-800/30 rounded-2xl">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400">No stops added yet. Click "Add Stop" to begin.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scheduleStops.map((stop, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-bold">
                              {stop.stopNumber}
                            </div>
                            <span className="font-medium text-white">Stop {stop.stopNumber}</span>
                          </div>
                          <Button 
                            type="button" 
                            onClick={() => removeStop(idx)}
                            variant="error"
                            size="sm"
                            className="btn-circle"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField 
                            label="Station" 
                            error={errors[`stop${idx}_stationId`]}
                          >
                            <Select 
                              value={stop.stationId} 
                              onChange={e => handleStopChange(idx, "stationId", e.target.value)}
                              options={allStations.map(st => ({
                                id: st.id,
                                name: `${st.name} (${st.code})`
                              }))}
                              placeholder="Select Station"
                              variant={errors[`stop${idx}_stationId`] ? "error" : "bordered"}
                              size="sm"
                            />
                          </FormField>

                          <FormField 
                            label="Arrival Time" 
                            error={errors[`stop${idx}_arrivalTime`]}
                          >
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input 
                                type="time" 
                                value={stop.arrivalTime}
                                onChange={e => handleStopChange(idx, "arrivalTime", e.target.value)}
                                variant={errors[`stop${idx}_arrivalTime`] ? "error" : "bordered"}
                                size="sm"
                                className="pl-10"
                              />
                            </div>
                          </FormField>

                          <FormField 
                            label="Departure Time" 
                            error={errors[`stop${idx}_departureTime`]}
                          >
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input 
                                type="time" 
                                value={stop.departureTime}
                                onChange={e => handleStopChange(idx, "departureTime", e.target.value)}
                                variant={errors[`stop${idx}_departureTime`] ? "error" : "bordered"}
                                size="sm"
                                className="pl-10"
                              />
                            </div>
                          </FormField>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {errors.scheduleStops && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.scheduleStops}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="divider"></div>
              
              <Card.Actions justify="end" className="gap-4">
                <Button 
                  type="button" 
                  onClick={() => navigate({ to: "/admin/schedules" })} 
                  variant="ghost"
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  variant="primary"
                  loading={isSubmitting}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Updating..." : "Update Schedule"}
                </Button>
              </Card.Actions>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}