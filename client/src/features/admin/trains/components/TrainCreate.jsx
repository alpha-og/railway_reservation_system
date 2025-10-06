import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Train, 
  Code, 
  Plus, 
  Minus, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle,
  Sparkles,
  Settings,
  Users,
  Edit3,
  DollarSign
} from "lucide-react";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import { FormField, Input, Select } from "../../../../components/ui/index.js";
import { PageLoadingSkeleton } from "../../../../components/LoadingSkeleton.jsx";
import trainAdminService from "../services/trainAdmin.service";

export default function TrainCreate() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [coachTypes, setCoachTypes] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoadingData(true);
      try {
        setError("");
        const [coachTypesRes, seatTypesRes] = await Promise.all([
          trainAdminService.getCoachTypes(),
          trainAdminService.getSeatTypes(),
        ]);
        setCoachTypes(coachTypesRes);
        setSeatTypes(seatTypesRes);
      } catch {
        setError("Failed to load coach or seat types.");
      } finally {
        setIsLoadingData(false);
      }
    }
    fetchData();
  }, []);

  const handleAddCoach = () => {
    setCoaches((prev) => [
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
  };

  const handleRemoveCoach = (idx) => {
    setCoaches((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCoachTypeChange = (idx, coach_type_id) => {
    setCoaches((prev) =>
      prev.map((coach, i) =>
        i === idx
          ? { ...coach, coach_type_id, fare_per_km: "", seat_types: [], seatTypeToAdd: "", isEditing: true }
          : coach
      )
    );
  };

  const handleCoachCodeChange = (idx, code) => {
    setCoaches((prev) =>
      prev.map((coach, i) => (i === idx ? { ...coach, code } : coach))
    );
  };

  const handleEditCoach = (idx) => {
    setCoaches((prev) =>
      prev.map((coach, i) => (i === idx ? { ...coach, isEditing: true } : coach))
    );
  };

  const handleCoachFareChange = (idx, fare_per_km) => {
    setCoaches((prev) =>
      prev.map((coach, i) => (i === idx ? { ...coach, fare_per_km } : coach))
    );
  };

  const handleAddSeatType = (coachIdx) => {
    setCoaches((prev) =>
      prev.map((coach, i) => {
        if (i !== coachIdx) return coach;
        const seatTypeId = coach.seatTypeToAdd;
        if (!seatTypeId || coach.seat_types.find(st => st.seat_type_id === seatTypeId)) return coach;
        return {
          ...coach,
          seat_types: [...coach.seat_types, { seat_type_id: seatTypeId, seat_count: "1" }],
          seatTypeToAdd: "",
        };
      })
    );
  };

  const handleRemoveSeatType = (coachIdx, seatTypeId) => {
    setCoaches((prev) =>
      prev.map((coach, i) =>
        i === coachIdx ? { ...coach, seat_types: coach.seat_types.filter(s => s.seat_type_id !== seatTypeId) } : coach
      )
    );
  };

  const handleSeatCountChange = (coachIdx, seatIdx, seat_count) => {
    setCoaches((prev) =>
      prev.map((coach, i) =>
        i === coachIdx
          ? { ...coach, seat_types: coach.seat_types.map((seat, j) => (j === seatIdx ? { ...seat, seat_count } : seat)) }
          : coach
      )
    );
  };

  const handleSeatTypeDropdown = (coachIdx, seatTypeToAdd) => {
    setCoaches((prev) =>
      prev.map((coach, i) => (i === coachIdx ? { ...coach, seatTypeToAdd } : coach))
    );
  };

  const handleSaveCoach = (idx) => {
    setCoaches((prev) =>
      prev.map((coach, i) => (i === idx ? { ...coach, isEditing: false } : coach))
    );
  };

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
    setLoading(true);
    
    if (!name.trim() || !code.trim()) {
      setError("Train name and code are required.");
      setLoading(false);
      return;
    }
    
    if (hasCoachCodeDuplicates) {
      setError("Coach codes must not be duplicated.");
      setLoading(false);
      return;
    }
    
    if (!coaches.length) {
      setError("Add at least one coach.");
      setLoading(false);
      return;
    }
    
    for (const coach of coaches) {
      if (!coach.code || !coach.coach_type_id) {
        setError("Please select a coach type and provide a code for every coach.");
        setLoading(false);
        return;
      }
      if (!coach.fare_per_km || isNaN(Number(coach.fare_per_km))) {
        setError("Fare per km must be a number for every coach.");
        setLoading(false);
        return;
      }
      if (!coach.seat_types.length) {
        setError("Please add at least one seat type for every coach.");
        setLoading(false);
        return;
      }
      for (const seat of coach.seat_types) {
        if (
          seat.seat_count === "" ||
          isNaN(Number(seat.seat_count)) ||
          Number(seat.seat_count) < 1
        ) {
          setError("Seat counts must be numbers (at least 1) for all seat types.");
          setLoading(false);
          return;
        }
      }
      if (hasSeatNumberDuplicates(coach)) {
        setError("Seat numbers within a coach must not be duplicated.");
        setLoading(false);
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
          fare_per_km: Number(coach.fare_per_km),
          seats,
        };
      }),
    };

    try {
      await trainAdminService.createTrain(payload);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/admin/trains" });
      }, 1500);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to create train.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingData) {
    return <PageLoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
          <motion.button 
            onClick={() => navigate({ to: "/admin/trains" })}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4 group"
            whileHover={{ x: -4 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Trains
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Plus className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Create New Train</h1>
              <p className="text-slate-400">Set up a new train with coaches and seating</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Action Messages */}
        {(error || success) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
              success 
                ? "bg-green-500/10 border-green-500/20 text-green-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {success ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {success ? "Train created successfully!" : error}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="max-w-6xl mx-auto bg-white/5 backdrop-blur-sm border-white/10">
            <form onSubmit={handleSubmit} className="space-y-8 p-8">
              {/* Basic Information */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Basic Information</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField label="Train Name" required>
                    <div className="relative">
                      <Train className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="e.g., Rajdhani Express"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </FormField>

                  <FormField label="Train Code" required>
                    <div className="relative">
                      <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="e.g., RJD"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="pl-10 uppercase"
                        required
                      />
                    </div>
                  </FormField>
                </div>
              </div>

              {/* Coach Configuration */}
              <div className="divider"></div>
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-400" />
                    <h2 className="text-xl font-semibold text-white">Coach Configuration</h2>
                  </div>
                  <Button 
                    type="button" 
                    onClick={handleAddCoach}
                    variant="success"
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Coach
                  </Button>
                </div>

                {coaches.length === 0 ? (
                  <div className="text-center py-12 bg-slate-800/30 rounded-2xl">
                    <Train className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-400">No coaches added yet. Click "Add Coach" to begin.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {coaches.map((coach, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                              <Train className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">Coach {idx + 1}</h3>
                              <p className="text-sm text-slate-400">Configure coach details</p>
                            </div>
                          </div>
                          <Button 
                            type="button" 
                            onClick={() => handleRemoveCoach(idx)}
                            variant="error"
                            size="sm"
                            className="btn-circle"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormField label="Coach Type" required>
                            <Select
                              value={coach.coach_type_id}
                              onChange={(e) => handleCoachTypeChange(idx, e.target.value)}
                              options={coachTypes.map(ct => ({ id: ct.id, name: ct.name }))}
                              placeholder="Select Coach Type"
                              disabled={!coach.isEditing}
                              required
                            />
                          </FormField>

                          <FormField label="Coach Code" required>
                            <div className="relative">
                              <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <Input
                                type="text"
                                placeholder="e.g., A1"
                                value={coach.code}
                                onChange={(e) => handleCoachCodeChange(idx, e.target.value)}
                                className="pl-10"
                                disabled={!coach.isEditing}
                                required
                              />
                            </div>
                          </FormField>
                        </div>

                        {coach.coach_type_id && coach.isEditing && (
                          <>
                            <FormField label="Fare per KM" required className="mb-4">
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={coach.fare_per_km}
                                  onChange={(e) => handleCoachFareChange(idx, e.target.value)}
                                  className="pl-10"
                                  required
                                />
                              </div>
                            </FormField>

                            <div className="mb-4">
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                Add Seat Type
                              </label>
                              <div className="flex gap-2">
                                <Select
                                  value={coach.seatTypeToAdd || ""}
                                  onChange={(e) => handleSeatTypeDropdown(idx, e.target.value)}
                                  options={seatTypes
                                    .filter(st => !coach.seat_types.find(s => s.seat_type_id === st.id))
                                    .map(st => ({ id: st.id, name: st.name }))}
                                  placeholder="Select Seat Type"
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  onClick={() => handleAddSeatType(idx)}
                                  disabled={!coach.seatTypeToAdd}
                                  variant="outline"
                                  size="sm"
                                >
                                  Add
                                </Button>
                              </div>
                            </div>

                            {coach.seat_types.length > 0 && (
                              <div className="space-y-3">
                                <label className="block text-sm font-medium text-slate-300">
                                  Seat Configuration
                                </label>
                                {coach.seat_types.map((seat, seatIdx) => {
                                  const seatType = seatTypes.find(st => st.id === seat.seat_type_id);
                                  return (
                                    <div key={seat.seat_type_id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                                      <Users className="w-4 h-4 text-slate-400" />
                                      <span className="flex-1 text-white font-medium">
                                        {seatType ? seatType.name : "Unknown"}
                                      </span>
                                      <Input
                                        type="number"
                                        min="1"
                                        value={seat.seat_count}
                                        onChange={(e) => handleSeatCountChange(idx, seatIdx, e.target.value)}
                                        className="w-20"
                                        required
                                      />
                                      <Button
                                        type="button"
                                        onClick={() => handleRemoveSeatType(idx, seat.seat_type_id)}
                                        variant="error"
                                        size="sm"
                                        className="btn-circle"
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            <div className="mt-4 flex justify-end">
                              <Button
                                type="button"
                                onClick={() => handleSaveCoach(idx)}
                                variant="success"
                                size="sm"
                                className="gap-2"
                              >
                                <Save className="w-4 h-4" />
                                Save Coach
                              </Button>
                            </div>
                          </>
                        )}

                        {coach.coach_type_id && !coach.isEditing && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-white font-medium">
                                  Coach Code: <span className="font-mono">{coach.code}</span>
                                </p>
                                <p className="text-slate-400">
                                  Fare: ${coach.fare_per_km}/km
                                </p>
                              </div>
                              <Button
                                type="button"
                                onClick={() => handleEditCoach(idx)}
                                variant="outline"
                                size="sm"
                                className="gap-2"
                              >
                                <Edit3 className="w-4 h-4" />
                                Edit
                              </Button>
                            </div>
                            <div>
                              <h4 className="text-slate-300 font-medium mb-2">Seats:</h4>
                              <div className="space-y-1">
                                {coach.seat_types.map(seat => {
                                  const seatType = seatTypes.find(st => st.id === seat.seat_type_id);
                                  return (
                                    <div key={seat.seat_type_id} className="text-slate-400">
                                      {seatType ? seatType.name : "Unknown"}: {seat.seat_count} seats
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="divider"></div>
              
              <Card.Actions justify="end" className="gap-4">
                <Button 
                  type="button" 
                  onClick={() => navigate({ to: "/admin/trains" })} 
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
                  {loading ? "Creating..." : "Create Train"}
                </Button>
              </Card.Actions>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}