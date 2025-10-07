import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Train, 
  Calendar, 
  Clock, 
  MapPin,
  Edit,
  AlertCircle,
  Sparkles,
  Route,
  Navigation,
  Users
} from "lucide-react";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import { PageLoadingSkeleton } from "../../../../components/LoadingSkeleton.jsx";
import { getScheduleById } from "../services/scheduleService.js";
import stationService from "../../../admin/stations/services/stationService.js";
import trainService from "../../../admin/trains/services/trainAdmin.service.js";

export default function ScheduleView({ scheduleId }) {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [train, setTrain] = useState(null);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [scheduleResp, stationsResp, trainsResp] = await Promise.all([
          getScheduleById(scheduleId),
          stationService.getAllStations(),
          trainService.getTrains(),
        ]);
        
        if (ignore) return;
        
        const scheduleData = scheduleResp.data?.schedule || scheduleResp.schedule || scheduleResp.data || scheduleResp;
        setSchedule(scheduleData);
        
        const stationsArr = stationsResp.stations || stationsResp.data?.stations || [];
        setStations(stationsArr);
        
        const trainsArr = trainsResp.data?.trains || trainsResp.trains || trainsResp || [];
        const trainData = trainsArr.find(t => t.id === scheduleData.train_id);
        setTrain(trainData);
        
      } catch (e) {
        setError(e.message || "Failed to load schedule data.");
      } finally {
        setLoading(false);
      }
    }
    if (scheduleId) fetchData();
    return () => { ignore = true; };
  }, [scheduleId]);

  if (loading) return <PageLoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="max-w-lg mx-auto bg-white/5 backdrop-blur-sm border-white/10">
          <div className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-bold mb-4 text-white">Error Loading Schedule</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <Button
              onClick={() => navigate({ to: "/admin/schedules" })}
              variant="primary"
            >
              Back to Schedules
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="max-w-lg mx-auto bg-white/5 backdrop-blur-sm border-white/10">
          <div className="p-8 text-center">
            <Train className="w-16 h-16 mx-auto mb-4 text-slate-600" />
            <h2 className="text-2xl font-bold mb-4 text-white">Schedule Not Found</h2>
            <p className="text-slate-400 mb-6">The requested schedule could not be found.</p>
            <Button
              onClick={() => navigate({ to: "/admin/schedules" })}
              variant="primary"
            >
              Back to Schedules
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStationName = (stationId) => {
    const station = stations.find(s => s.id === stationId);
    return station ? `${station.name} (${station.code})` : `Station ${stationId}`;
  };

  const scheduleStops = schedule.schedule_stops || [];
  const totalStops = scheduleStops.length;

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
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Train className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {train ? `${train.name} (${train.code})` : 'Schedule Details'}
                </h1>
                <p className="text-slate-400">Schedule Information & Route</p>
              </div>
            </div>
            <Button 
              onClick={() =>
                navigate({
                  to: `/admin/schedules/${scheduleId}/edit`,
                })
              }
              variant="primary"
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Schedule
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Schedule Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <h3 className="text-lg font-semibold text-white mb-1">Departure Date</h3>
              <p className="text-blue-400 font-medium">{formatDate(schedule.departure_date)}</p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 text-green-400" />
              <h3 className="text-lg font-semibold text-white mb-1">Departure Time</h3>
              <p className="text-green-400 font-medium text-xl">{formatTime(schedule.departure_time)}</p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3 text-purple-400" />
              <h3 className="text-lg font-semibold text-white mb-1">Total Stops</h3>
              <p className="text-purple-400 font-bold text-2xl">{totalStops}</p>
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6 text-center">
              <Train className="w-8 h-8 mx-auto mb-3 text-orange-400" />
              <h3 className="text-lg font-semibold text-white mb-1">Train</h3>
              <p className="text-orange-400 font-medium">
                {train ? train.code : 'N/A'}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Schedule Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Train Information */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Train Information</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Train className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400">Train Name</div>
                    <div className="font-semibold text-lg text-white">
                      {train ? train.name : 'Unknown Train'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400">Train Code</div>
                    <div className="font-mono font-semibold text-lg text-white">
                      {train ? train.code : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-slate-400">Schedule ID</div>
                    <div className="font-mono font-semibold text-white">#{schedule.id}</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Route Stops */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Route className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Route Stops</h2>
              </div>

              {scheduleStops.length === 0 ? (
                <div className="text-center py-12">
                  <Navigation className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-lg font-medium text-slate-300 mb-2">No Stops Configured</h3>
                  <p className="text-slate-400">This schedule doesn't have any stops configured yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {scheduleStops
                    .sort((a, b) => a.stop_number - b.stop_number)
                    .map((stop, index) => (
                      <motion.div
                        key={stop.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg hover:bg-slate-700/40 transition-colors"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 bg-blue-500/20 text-blue-300 rounded-full flex items-center justify-center text-sm font-bold">
                            {stop.stop_number}
                          </div>
                          {index < scheduleStops.length - 1 && (
                            <div className="w-0.5 h-8 bg-slate-600 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-white">
                            {getStationName(stop.station?.id || stop.station_id)}
                          </div>
                          <div className="flex gap-4 text-sm text-slate-400 mt-1">
                            <span>Arr: {formatTime(stop.arrival_time)}</span>
                            <span>Dep: {formatTime(stop.departure_time)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}