import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Train, 
  Code, 
  Edit, 
  AlertCircle, 
  Sparkles,
  Settings,
  Users,
  MapPin,
  DollarSign,
  Calendar
} from "lucide-react";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import { PageLoadingSkeleton } from "../../../../components/LoadingSkeleton.jsx";
import trainAdminService from "../services/trainAdmin.service";

export default function TrainView({ trainId }) {
  const navigate = useNavigate();
  const [train, setTrain] = useState(null);
  const [coachTypes, setCoachTypes] = useState([]);
  const [seatTypes, setSeatTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setTrain(train);
        setCoachTypes(coachTypesRes);
        setSeatTypes(seatTypesRes);
      } catch (e) {
        setError(e.message || "Failed to load train or type data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [trainId]);

  if (loading) return <PageLoadingSkeleton />;

  if (error) {
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

  if (!train) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="max-w-lg mx-auto bg-white/5 backdrop-blur-sm border-white/10">
          <div className="p-8 text-center">
            <Train className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <h2 className="text-2xl font-bold mb-4 text-white">Train Not Found</h2>
            <p className="text-slate-400 mb-6">The requested train could not be found.</p>
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

  const totalSeats = train.coaches?.reduce((sum, coach) => sum + (coach.seats?.length || 0), 0) || 0;
  const totalCoaches = train.coaches?.length || 0;

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
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Train className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{train.name}</h1>
                <p className="text-slate-400">Train Details & Configuration</p>
              </div>
            </div>
            <Button 
              onClick={() =>
                navigate({
                  to: "/admin/trains/$trainId/edit",
                  params: { trainId },
                })
              }
              variant="primary"
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Train
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Train Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6 text-center">
              <Code className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <h3 className="text-lg font-semibold text-white mb-1">Train Code</h3>
              <p className="text-2xl font-mono font-bold text-blue-400">{train.code}</p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6 text-center">
              <Settings className="w-8 h-8 mx-auto mb-3 text-green-400" />
              <h3 className="text-lg font-semibold text-white mb-1">Total Coaches</h3>
              <p className="text-2xl font-bold text-green-400">{totalCoaches}</p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-purple-400" />
              <h3 className="text-lg font-semibold text-white mb-1">Total Seats</h3>
              <p className="text-2xl font-bold text-purple-400">{totalSeats}</p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-orange-400" />
              <h3 className="text-lg font-semibold text-white mb-1">Status</h3>
              <p className="text-sm font-medium text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full">
                Active
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Coach Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Coach Configuration</h2>
              </div>

              {(!train.coaches?.length) ? (
                <div className="text-center py-12">
                  <Train className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-lg font-medium text-slate-300 mb-2">No Coaches Found</h3>
                  <p className="text-slate-400">This train doesn't have any coaches configured yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {train.coaches.map((coach, i) => {
                    const coachTypeLabel = coach.coach_type_name
                      || (coachTypes.find(ct => String(ct.id) === String(coach.coach_type_id))?.name)
                      || coach.coach_type_id
                      || "Unknown";

                    const seatTypeMap = {};
                    (coach.seats || []).forEach(seat => {
                      const seatTypeLabel = seat.seat_type_name
                        || (seatTypes.find(st => String(st.id) === String(seat.seat_type_id))?.name)
                        || seat.seat_type_id
                        || "Unknown Seat Type";
                      if (!seatTypeMap[seatTypeLabel]) seatTypeMap[seatTypeLabel] = 0;
                      seatTypeMap[seatTypeLabel]++;
                    });

                    return (
                      <motion.div
                        key={coach.code || i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-800/30 border border-slate-700 rounded-lg p-6"
                      >
                        {/* Coach Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                              <Train className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-white">
                                Coach {coach.code}
                              </h3>
                              <p className="text-sm text-slate-400">{coachTypeLabel}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-400">Total Seats</div>
                            <div className="text-lg font-semibold text-white">{coach.seats?.length || 0}</div>
                          </div>
                        </div>

                        {/* Coach Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                            <Code className="w-4 h-4 text-slate-400" />
                            <div>
                              <div className="text-xs text-slate-400">Coach Code</div>
                              <div className="font-mono font-medium text-white">{coach.code}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                            <Settings className="w-4 h-4 text-slate-400" />
                            <div>
                              <div className="text-xs text-slate-400">Coach Type</div>
                              <div className="font-medium text-white">{coachTypeLabel}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 p-3 bg-slate-700/30 rounded-lg">
                            <DollarSign className="w-4 h-4 text-slate-400" />
                            <div>
                              <div className="text-xs text-slate-400">Fare/KM</div>
                              <div className="font-medium text-white">
                                {coach.fare_per_km ? `$${coach.fare_per_km}` : "Not set"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Seat Types */}
                        <div>
                          <h4 className="font-medium text-slate-300 mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Seat Configuration
                          </h4>
                          {Object.entries(seatTypeMap).length === 0 ? (
                            <div className="text-slate-400 text-sm">No seats configured</div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {Object.entries(seatTypeMap).map(([seatTypeLabel, count]) => (
                                <div key={seatTypeLabel} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                  <span className="font-medium text-slate-300">{seatTypeLabel}</span>
                                  <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-sm font-medium">
                                    {count} seats
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex gap-4 justify-center"
        >
          <Button 
            onClick={() => navigate({ to: "/admin/trains" })}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trains
          </Button>
          <Button 
            onClick={() =>
              navigate({
                to: "/admin/trains/$trainId/edit",
                params: { trainId },
              })
            }
            variant="primary"
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Configuration
          </Button>
        </motion.div>
      </div>
    </div>
  );
}