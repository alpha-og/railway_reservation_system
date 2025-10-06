import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Train, 
  Calendar, 
  Clock, 
  MapPin,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Eye
} from "lucide-react";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import { Input, Select } from "../../../../components/ui/index.js";
import { LoadingSkeleton } from "../../../../components/LoadingSkeleton.jsx";
import { getSchedules, deleteSchedule } from "../services/scheduleService.js";
import trainService from "../../../admin/trains/services/trainAdmin.service.js";

export default function ScheduleList() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [trains, setTrains] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrain, setSelectedTrain] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [schedulesResp, trainsResp] = await Promise.all([
          getSchedules(),
          trainService.getTrains()
        ]);

        const allSchedules = schedulesResp.data || [];
        const trainArr = trainsResp.data?.trains || trainsResp.trains || trainsResp || [];
        
        setSchedules(allSchedules);
        setFilteredSchedules(allSchedules);
        setTrains(trainArr);
      } catch {
        setSchedules([]);
        setFilteredSchedules([]);
        setActionMessage("Failed to load schedules. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refresh]);

  // Filter schedules based on search criteria
  useEffect(() => {
    let filtered = schedules;

    if (searchTerm) {
      filtered = filtered.filter(schedule => {
        const train = trains.find(t => t.id === schedule.train_id);
        const trainName = train ? `${train.name} ${train.code}` : "";
        return trainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               schedule.departure_date.includes(searchTerm) ||
               schedule.departure_time.includes(searchTerm);
      });
    }

    if (selectedTrain) {
      filtered = filtered.filter(schedule => schedule.train_id === selectedTrain);
    }

    if (selectedDate) {
      filtered = filtered.filter(schedule => schedule.departure_date === selectedDate);
    }

    setFilteredSchedules(filtered);
  }, [schedules, trains, searchTerm, selectedTrain, selectedDate]);

  const trainName = (id) => {
    const t = trains.find(t => t.id === id);
    return t ? `${t.name} (${t.code})` : `Train ${id}`;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule? This action cannot be undone.")) return;
    
    setActionMessage("");
    try {
      const resp = await deleteSchedule(id);
      if (resp.success) {
        setActionMessage("Schedule deleted successfully!");
        setRefresh(r => r + 1);
      } else {
        setActionMessage("Failed to delete schedule. Please try again.");
      }
    } catch (err) {
      setActionMessage(err.message || "An error occurred while deleting the schedule.");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTrain("");
    setSelectedDate("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-xl w-12 h-12">
                  <Train className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Schedule Management</h1>
                <p className="text-base-content/60">Manage train schedules and routes</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate({ to: "/admin/schedules/create" })}
              variant="success"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Schedule
            </Button>
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 bg-base-100/90 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <Filter className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Filters</h2>
              {(searchTerm || selectedTrain || selectedDate) && (
                <Button 
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                >
                  Clear All
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                <Input
                  type="text"
                  placeholder="Search schedules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={selectedTrain}
                onChange={(e) => setSelectedTrain(e.target.value)}
                options={trains.map(train => ({
                  id: train.id,
                  name: `${train.name} (${train.code})`
                }))}
                placeholder="All Trains"
              />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                placeholder="Filter by date"
              />
              <Button 
                onClick={() => setRefresh(r => r + 1)}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Schedule List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-base-100/90 backdrop-blur-sm">
            {loading ? (
              <div className="text-center py-12">
                <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                <p className="text-base-content/60">Loading schedules...</p>
              </div>
            ) : filteredSchedules.length === 0 ? (
              <div className="text-center py-12">
                <Train className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                <h3 className="text-xl font-medium mb-2">
                  {schedules.length === 0 ? "No schedules found" : "No schedules match your filters"}
                </h3>
                <p className="text-base-content/60 mb-6">
                  {schedules.length === 0 
                    ? "Get started by creating your first schedule." 
                    : "Try adjusting your search criteria or clear the filters."}
                </p>
                {schedules.length === 0 && (
                  <Button 
                    onClick={() => navigate({ to: "/admin/schedules/create" })}
                    variant="success"
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create First Schedule
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">
                      {filteredSchedules.length} Schedule{filteredSchedules.length !== 1 ? 's' : ''}
                    </h2>
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="table table-lg">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Train</th>
                        <th>Stops</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchedules.map((schedule, index) => (
                        <motion.tr 
                          key={schedule.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover"
                        >
                          <td>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 font-medium">
                                <Calendar className="w-4 h-4 text-primary" />
                                {formatDate(schedule.departure_date)}
                              </div>
                              <div className="flex items-center gap-2 text-sm opacity-70">
                                <Clock className="w-3 h-3" />
                                {formatTime(schedule.departure_time)}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="avatar placeholder">
                                <div className="bg-primary text-primary-content rounded w-8 h-8 text-xs">
                                  <Train className="w-4 h-4" />
                                </div>
                              </div>
                              <span className="font-medium">{trainName(schedule.train_id)}</span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-accent" />
                              <span className="badge badge-outline">
                                {schedule.schedule_stops?.length || 0} stops
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                onClick={() => navigate({ to: `/admin/schedules/${schedule.id}/edit` })}
                                variant="ghost"
                                size="sm"
                                className="btn-circle"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                onClick={() => handleDelete(schedule.id)}
                                variant="ghost"
                                size="sm"
                                className="btn-circle text-error hover:bg-error/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {filteredSchedules.map((schedule, index) => (
                    <motion.div 
                      key={schedule.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="card bg-base-200 shadow-lg"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 font-medium">
                              <Calendar className="w-4 h-4 text-primary" />
                              {formatDate(schedule.departure_date)}
                            </div>
                            <div className="flex items-center gap-2 text-sm opacity-70">
                              <Clock className="w-3 h-3" />
                              {formatTime(schedule.departure_time)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => navigate({ to: `/admin/schedules/${schedule.id}/edit` })}
                              variant="ghost"
                              size="sm"
                              className="btn-circle"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              onClick={() => handleDelete(schedule.id)}
                              variant="ghost"
                              size="sm"
                              className="btn-circle text-error hover:bg-error/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Train className="w-4 h-4 text-primary" />
                            <span className="font-medium">{trainName(schedule.train_id)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span className="badge badge-outline">
                              {schedule.schedule_stops?.length || 0} stops
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}