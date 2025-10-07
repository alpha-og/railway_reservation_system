import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  MapPin, 
  Code, 
  Building2, 
  Route, 
  Edit, 
  AlertCircle, 
  Sparkles,
  Calendar,
  Navigation,
  Users,
  Train
} from "lucide-react";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import { PageLoadingSkeleton } from "../../../../components/LoadingSkeleton.jsx";
import stationService from "../services/stationService.js";

export default function StationView({ stationId }) {
  const navigate = useNavigate();
  const [station, setStation] = useState(null);
  const [allStations, setAllStations] = useState([]);
  const [distances, setDistances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [stationResp, stationsResp, distancesResp] = await Promise.all([
          stationService.getStationById(stationId),
          stationService.getAllStations(),
          stationService.getStationDistances(),
        ]);
        
        if (ignore) return;
        
        const stationData = stationResp?.station || stationResp?.data?.station || 
                           (stationResp?.success && stationResp?.data?.station);
        
        setStation(stationData);
        
        const stationsArr = stationsResp?.stations || stationsResp?.data?.stations || [];
        setAllStations(stationsArr);
        
        const distancesArr = distancesResp?.distances || distancesResp?.data?.distances || [];
        const stationDistances = distancesArr.filter(d => 
          String(d.from_station_id) === String(stationId)
        );
        setDistances(stationDistances);
        
      } catch (e) {
        setError(e.message || "Failed to load station data.");
      } finally {
        setLoading(false);
      }
    }
    if (stationId) fetchData();
    return () => { ignore = true; };
  }, [stationId]);

  if (loading) return <PageLoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <Card className="max-w-lg mx-auto shadow-2xl bg-base-100/90 backdrop-blur-sm">
          <div className="card-body text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-error" />
            <h2 className="card-title text-2xl justify-center mb-4">Error Loading Station</h2>
            <p className="text-base-content/60 mb-6">{error}</p>
            <Button
              onClick={() => navigate({ to: "/admin/stations" })}
              className="btn btn-primary"
            >
              Back to Stations
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <Card className="max-w-lg mx-auto shadow-2xl bg-base-100/90 backdrop-blur-sm">
          <div className="card-body text-center">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
            <h2 className="card-title text-2xl justify-center mb-4">Station Not Found</h2>
            <p className="text-base-content/60 mb-6">The requested station could not be found.</p>
            <Button
              onClick={() => navigate({ to: "/admin/stations" })}
              className="btn btn-primary"
            >
              Back to Stations
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const connectedStations = distances.map(d => {
    const connectedStation = allStations.find(s => String(s.id) === String(d.to_station_id));
    return {
      ...connectedStation,
      distance: d.distance
    };
  }).filter(Boolean);

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
            onClick={() => navigate({ to: "/admin/stations" })}
            className="btn btn-ghost btn-sm gap-2 mb-4 group"
            whileHover={{ x: -4 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Stations
          </motion.button>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-xl w-12 h-12">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold">{station.name}</h1>
                <p className="text-base-content/60">Station Details & Connections</p>
              </div>
            </div>
            <Button 
              onClick={() =>
                navigate({
                  to: "/admin/stations/$stationId/edit",
                  params: { stationId },
                })
              }
              className="btn btn-primary gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Station
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Station Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="stats shadow-xl bg-base-100/90 backdrop-blur-sm">
            <div className="stat place-items-center">
              <div className="stat-figure text-primary">
                <Code className="w-8 h-8" />
              </div>
              <div className="stat-title">Station Code</div>
              <div className="stat-value text-primary text-2xl font-mono">{station.code}</div>
            </div>
          </div>

          <div className="stats shadow-xl bg-base-100/90 backdrop-blur-sm">
            <div className="stat place-items-center">
              <div className="stat-figure text-success">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="stat-title">City</div>
              <div className="stat-value text-success text-xl">{station.city}</div>
            </div>
          </div>

          <div className="stats shadow-xl bg-base-100/90 backdrop-blur-sm">
            <div className="stat place-items-center">
              <div className="stat-figure text-secondary">
                <Route className="w-8 h-8" />
              </div>
              <div className="stat-title">Connections</div>
              <div className="stat-value text-secondary">{connectedStations.length}</div>
            </div>
          </div>

          <div className="stats shadow-xl bg-base-100/90 backdrop-blur-sm">
            <div className="stat place-items-center">
              <div className="stat-figure text-warning">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="stat-title">Status</div>
              <div className="stat-value">
                <span className="badge badge-success">Active</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Station Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Basic Information */}
          <Card className="shadow-xl bg-base-100/90 backdrop-blur-sm">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="card-title text-xl">Station Information</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                  <div className="avatar placeholder">
                    <div className="bg-primary/20 text-primary rounded-lg w-12 h-12">
                      <MapPin className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-base-content/60">Station Name</div>
                    <div className="font-semibold text-lg">{station.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                  <div className="avatar placeholder">
                    <div className="bg-success/20 text-success rounded-lg w-12 h-12">
                      <Code className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-base-content/60">Station Code</div>
                    <div className="font-mono font-semibold text-lg">{station.code}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                  <div className="avatar placeholder">
                    <div className="bg-secondary/20 text-secondary rounded-lg w-12 h-12">
                      <Building2 className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-base-content/60">City</div>
                    <div className="font-semibold text-lg">{station.city}</div>
                  </div>
                </div>

                {station.created_at && (
                  <div className="flex items-center gap-4 p-4 bg-base-200 rounded-lg">
                    <div className="avatar placeholder">
                      <div className="bg-warning/20 text-warning rounded-lg w-12 h-12">
                        <Calendar className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-base-content/60">Created Date</div>
                      <div className="font-semibold">{new Date(station.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Route Connections */}
          <Card className="shadow-xl bg-base-100/90 backdrop-blur-sm">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-6">
                <Route className="w-5 h-5 text-primary" />
                <h2 className="card-title text-xl">Route Connections</h2>
              </div>

              {connectedStations.length === 0 ? (
                <div className="text-center py-12">
                  <Navigation className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                  <h3 className="text-lg font-medium mb-2">No Route Connections</h3>
                  <p className="text-base-content/60">This station doesn't have any route connections configured yet.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {connectedStations.map((connectedStation, index) => (
                    <motion.div
                      key={connectedStation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary/20 text-primary rounded w-10 h-10">
                            <Train className="w-5 h-5" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{connectedStation.name}</div>
                          <div className="text-sm text-base-content/60">
                            {connectedStation.code} • {connectedStation.city}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="badge badge-primary font-mono">
                          {connectedStation.distance} km
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
            onClick={() => navigate({ to: "/admin/stations" })}
            className="btn btn-ghost gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Stations
          </Button>
          <Button 
            onClick={() =>
              navigate({
                to: "/admin/stations/$stationId/edit",
                params: { stationId },
              })
            }
            className="btn btn-primary gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Station
          </Button>
        </motion.div>
      </div>
    </div>
  );
}