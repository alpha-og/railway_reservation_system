import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
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
  Sparkles
} from "lucide-react";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import { FormField, Input, Select } from "../../../../components/ui/index.js";
import { LoadingSkeleton, PageLoadingSkeleton } from "../../../../components/LoadingSkeleton.jsx";
import { createSchedule } from "../services/scheduleService.js";
import stationService from "../../../admin/stations/services/stationService.js";
import trainService from "../../../admin/trains/services/trainAdmin.service.js";

export default function ScheduleCreate() {
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
    async function fetchData() {
      setIsLoading(true);
      try {
        const [stationsResp, trainsResp] = await Promise.all([
          stationService.getAllStations(),
          trainService.getTrains()
        ]);

        const stations = stationsResp.stations || stationsResp.data?.stations || [];
        const trains = trainsResp.data?.trains || trainsResp.trains || trainsResp || [];
        
        setAllStations(stations);
        setAllTrains(trains);
      } catch {
        setActionMessage("Failed to load data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

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
      const response = await createSchedule({
        trainId: formData.trainId,
        departureDate: formData.departureDate,
        departureTime: formData.departureTime,
        scheduleStops,
      });
      
      if (response.success) {
        setActionMessage("Schedule created successfully!");
        setTimeout(() => navigate({ to: "/admin/schedules" }), 1500);
      } else {
        setActionMessage("Failed to create schedule. Please try again.");
      }
    } catch (err) {
      setActionMessage(err.message || "An error occurred while creating the schedule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,oklch(var(--color-primary)/0.02)_50%,transparent_75%)]" />
      </div>

      {/* Header */}
      <div className="relative z-10 bg-base-100/80 backdrop-blur-sm border-b border-base-content/10">
        <div className="container mx-auto px-6 py-6">
          <motion.button 
            onClick={() => navigate({ to: "/admin/schedules" })}
            className="btn btn-ghost btn-sm gap-2 mb-4 group"
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
            <div className="avatar placeholder">
              <div className="bg-success text-success-content rounded-xl w-12 h-12">
                <Plus className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Create New Schedule</h1>
              <p className="text-base-content/60">Set up a new train schedule with stops</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Action Message */}
        {actionMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`alert mb-6 ${
              actionMessage.includes("success") ? "alert-success" : "alert-error"
            }`}
          >
            {actionMessage.includes("success") ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{actionMessage}</span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="max-w-4xl mx-auto shadow-2xl bg-base-100/90 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Basic Information</h2>
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
                    <Input 
                      type="date" 
                      name="departureDate" 
                      value={formData.departureDate}
                      onChange={handleChange}
                      variant={errors.departureDate ? "error" : "bordered"}
                    />
                  </FormField>

                  <FormField label="Departure Time" error={errors.departureTime} required>
                    <Input 
                      type="time" 
                      name="departureTime" 
                      value={formData.departureTime}
                      onChange={handleChange}
                      variant={errors.departureTime ? "error" : "bordered"}
                    />
                  </FormField>
                </div>
              </div>

              {/* Schedule Stops */}
              <div className="divider"></div>
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Schedule Stops</h2>
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
                  <div className="text-center py-12 bg-base-200 rounded-2xl">
                    <MapPin className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                    <p className="text-base-content/60">No stops added yet. Click "Add Stop" to begin.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scheduleStops.map((stop, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="card bg-base-200 shadow-lg"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="badge badge-primary badge-lg font-bold">
                                {stop.stopNumber}
                              </div>
                              <span className="font-medium">Stop {stop.stopNumber}</span>
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
                              <Input 
                                type="time" 
                                value={stop.arrivalTime}
                                onChange={e => handleStopChange(idx, "arrivalTime", e.target.value)}
                                variant={errors[`stop${idx}_arrivalTime`] ? "error" : "bordered"}
                                size="sm"
                              />
                            </FormField>

                            <FormField 
                              label="Departure Time" 
                              error={errors[`stop${idx}_departureTime`]}
                            >
                              <Input 
                                type="time" 
                                value={stop.departureTime}
                                onChange={e => handleStopChange(idx, "departureTime", e.target.value)}
                                variant={errors[`stop${idx}_departureTime`] ? "error" : "bordered"}
                                size="sm"
                              />
                            </FormField>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {errors.scheduleStops && (
                  <div className="alert alert-error">
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
                  {isSubmitting ? "Creating..." : "Create Schedule"}
                </Button>
              </Card.Actions>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}