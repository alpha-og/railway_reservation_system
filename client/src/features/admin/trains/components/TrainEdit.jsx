import { useEffect, useState } from "react";
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
          // Group seats by seat type
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
            seat_types: Object.values(seatTypeMap),
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
      }, 1500);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to update train.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoadingSkeleton />;

  if (error && !name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="max-w-lg mx-auto bg-white/5 backdrop-blur-sm border-white/10">
          <div className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-bold mb-4 text-white">Error Loading Train</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <Button
              onClick={() => navigate({ to: "/admin/trains" })}
              variant="primary"
            >
              Back to Trains
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
            onClick={() => navigate({ to: "/admin/trains/$trainId/view", params: { trainId } })}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4 group"
            whileHover={{ x: -4 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Train View
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
              <h1 className="text-3xl font-bold text-white">Edit Train</h1>
              <p className="text-slate-400">Update train configuration and seating</p>
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
            {success ? "Train updated successfully!" : error}
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

                <div className="space-y-6">
                  {coaches.map((coach, idx) => {
                    const coachTypeLabel = coach.coach_type_name
                      || (coachTypes.find(ct => String(ct.id) === String(coach.coach_type_id))?.name)
                      || coach.coach_type_id
                      || "";

                    return (
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
                              <h3 className="font-semibold text-white">
                                Coach {idx + 1}
                                {coachTypeLabel && <span className="text-blue-400 ml-2">({coachTypeLabel})</span>}
                              </h3>
                              <p className="text-sm text-slate-400">Coach configuration</p>
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
                              value={coach.coach_type_id || ""}
                              onChange={(e) => handleCoachTypeChange(idx, e.target.value)}
                              options={coachTypes.map(ct => ({ id: ct.id, name: ct.name }))}
                              placeholder="Select Coach Type"
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
                                required
                              />
                            </div>
                          </FormField>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Seat Configuration
                          </label>
                          {coach.seat_types.map((seat, seatIdx) => (
                            <div key={seat.seat_type_id} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg mb-2">
                              <Users className="w-4 h-4 text-slate-400" />
                              <span className="flex-1 text-white font-medium">
                                {seat.seat_type_label || seat.seat_type_id || "Unknown"}
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
                          ))}
                          
                          <div className="flex gap-2 mt-2">
                            <Select
                              value={coach.seatTypeToAdd || ""}
                              onChange={(e) => handleSeatTypeDropdown(idx, e.target.value)}
                              options={seatTypes
                                .filter(st => !coach.seat_types.find(s => s.seat_type_id === st.id))
                                .map(st => ({ id: st.id, name: st.name }))}
                              placeholder="Add Seat Type"
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

                        {coach.isEditing ? (
                          <div className="flex justify-end">
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
                        ) : (
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              onClick={() => handleEditCoach(idx)}
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Edit3 className="w-4 h-4" />
                              Edit Coach
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="divider"></div>
              
              <Card.Actions justify="end" className="gap-4">
                <Button 
                  type="button" 
                  onClick={() => navigate({ to: "/admin/trains/$trainId/view", params: { trainId } })} 
                  variant="ghost"
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  variant="primary"
                  loading={saving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Updating..." : "Update Train"}
                </Button>
              </Card.Actions>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}