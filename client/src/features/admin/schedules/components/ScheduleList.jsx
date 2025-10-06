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
  Sparkles
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
  const [deleteConfirm, setDeleteConfirm] = useState(null);

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
    setActionMessage("");
    try {
      const resp = await deleteSchedule(id);
      if (resp.success) {
        setActionMessage("Schedule deleted successfully!");
        setDeleteConfirm(null);
        setRefresh(r => r + 1);
        setTimeout(() => setActionMessage(""), 3000);
      } else {
        setActionMessage("Failed to delete schedule. Please try again.");
        setDeleteConfirm(null);
      }
    } catch (err) {
      setActionMessage(err.message || "An error occurred while deleting the schedule.");
      setDeleteConfirm(null);
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

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-6">
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
                <h1 className="text-3xl font-bold text-white">Schedule Management</h1>
                <p className="text-slate-400">Manage train schedules and routes</p>
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Filter className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Filters</h2>
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
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
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    placeholder="Filter by date"
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={() => setRefresh(r => r + 1)}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Schedule List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6">
              {filteredSchedules.length === 0 ? (
                <div className="text-center py-12">
                  <Train className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-xl font-medium text-slate-300 mb-2">
                    {schedules.length === 0 ? "No schedules found" : "No schedules match your filters"}
                  </h3>
                  <p className="text-slate-400 mb-6">
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
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      <h2 className="text-xl font-semibold text-white">
                        {filteredSchedules.length} Schedule{filteredSchedules.length !== 1 ? 's' : ''}
                      </h2>
                    </div>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-4 px-4 text-slate-300 font-medium">Date & Time</th>
                          <th className="text-left py-4 px-4 text-slate-300 font-medium">Train</th>
                          <th className="text-left py-4 px-4 text-slate-300 font-medium">Stops</th>
                          <th className="text-right py-4 px-4 text-slate-300 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSchedules.map((schedule, index) => (
                          <motion.tr 
                            key={schedule.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 font-medium text-white">
                                  <Calendar className="w-4 h-4 text-blue-400" />
                                  {formatDate(schedule.departure_date)}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(schedule.departure_time)}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Train className="w-4 h-4 text-green-400" />
                                <span className="font-medium text-white">{trainName(schedule.train_id)}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-orange-400" />
                                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                                  {schedule.schedule_stops?.length || 0} stops
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  onClick={() => navigate({ to: `/admin/schedules/${schedule.id}/edit` })}
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:bg-blue-500/10"
                                  title="Edit Schedule"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  onClick={() => setDeleteConfirm(schedule.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:bg-red-500/10"
                                  title="Delete Schedule"
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
                        className="p-4 bg-slate-800/30 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 font-medium text-white">
                              <Calendar className="w-4 h-4 text-blue-400" />
                              {formatDate(schedule.departure_date)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <Clock className="w-3 h-3" />
                              {formatTime(schedule.departure_time)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => navigate({ to: `/admin/schedules/${schedule.id}/edit` })}
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:bg-blue-500/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              onClick={() => setDeleteConfirm(schedule.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Train className="w-4 h-4 text-green-400" />
                            <span className="font-medium text-white">{trainName(schedule.train_id)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-orange-400" />
                            <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                              {schedule.schedule_stops?.length || 0} stops
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="max-w-md mx-4 bg-white/10 backdrop-blur-sm border-white/20">
              <div className="p-6 text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <h3 className="text-xl font-bold text-white mb-2">Confirm Delete</h3>
                <p className="text-slate-400 mb-6">
                  Are you sure you want to delete this schedule? This action cannot be undone.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => setDeleteConfirm(null)} 
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleDelete(deleteConfirm)} 
                    variant="error"
                  >
                    Delete Schedule
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}