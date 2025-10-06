import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Sparkles,
  Building2,
  Code,
  Calendar
} from "lucide-react";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import { Input, Select } from "../../../../components/ui/index.js";
import { LoadingSkeleton } from "../../../../components/LoadingSkeleton.jsx";
import { useStations } from "../hooks/useStations.js";

export default function StationsList() {
  const navigate = useNavigate();
  const {
    stations,
    loading,
    error,
    filters,
    handleSearch,
    handleCityFilter,
    resetFilters,
    handleDelete,
    refresh,
  } = useStations();

  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [cityFilter, setCityFilter] = useState(filters.city || "");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        handleSearch(searchInput);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput, handleSearch, filters.search]);

  const onCityFilterChange = (e) => {
    const value = e.target.value;
    setCityFilter(value);
    if (value !== filters.city) {
      handleCityFilter(value);
    }
  };

  const confirmDelete = async (stationId) => {
    const result = await handleDelete(stationId);
    if (result.success) {
      setDeleteMessage("Station deleted successfully!");
      setDeleteConfirm(null);
      setTimeout(() => setDeleteMessage(""), 3000);
    } else {
      setDeleteMessage("Failed to delete station. Please try again.");
      setDeleteConfirm(null);
    }
  };

  const uniqueCities = [...new Set(stations.map((s) => s.city).filter(Boolean))].sort();

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="max-w-lg mx-auto bg-white/5 backdrop-blur-sm border-white/10">
          <div className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-bold mb-4 text-white">Error</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <Button onClick={refresh} variant="primary">
              Try Again
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Station Management</h1>
                <p className="text-slate-400">Manage railway stations and connections</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate({ to: "/admin/stations/new" })}
              variant="success"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Station
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Action Message */}
        {deleteMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
              deleteMessage.includes("success") 
                ? "bg-green-500/10 border-green-500/20 text-green-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {deleteMessage.includes("success") ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {deleteMessage}
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
                {(filters.search || filters.city) && (
                  <Button 
                    onClick={() => {
                      setSearchInput("");
                      setCityFilter("");
                      resetFilters();
                    }}
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
                    placeholder="Search stations..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={cityFilter}
                  onChange={onCityFilterChange}
                  options={uniqueCities.map(city => ({ id: city, name: city }))}
                  placeholder="All Cities"
                />
                <div></div>
                <Button 
                  onClick={refresh}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
              {(filters.search || filters.city) && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  <span className="text-sm text-slate-300 font-medium">Active Filters:</span>
                  {filters.search && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      Search: "{filters.search}"
                    </span>
                  )}
                  {filters.city && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      City: {filters.city}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Station List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6">
              {stations.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-xl font-medium text-slate-300 mb-2">
                    {filters.search || filters.city ? "No stations match your filters" : "No stations found"}
                  </h3>
                  <p className="text-slate-400 mb-6">
                    {filters.search || filters.city 
                      ? "Try adjusting your search criteria or clear the filters." 
                      : "Get started by adding your first station."}
                  </p>
                  {!filters.search && !filters.city && (
                    <Button 
                      onClick={() => navigate({ to: "/admin/stations/new" })}
                      variant="success"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add First Station
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      <h2 className="text-xl font-semibold text-white">
                        {stations.length} Station{stations.length !== 1 ? 's' : ''}
                      </h2>
                    </div>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-4 px-4 text-slate-300 font-medium">Code</th>
                          <th className="text-left py-4 px-4 text-slate-300 font-medium">Station Name</th>
                          <th className="text-left py-4 px-4 text-slate-300 font-medium">City</th>
                          <th className="text-left py-4 px-4 text-slate-300 font-medium">Created</th>
                          <th className="text-right py-4 px-4 text-slate-300 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stations.map((station, index) => (
                          <motion.tr 
                            key={station.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-blue-400" />
                                <span className="font-mono font-medium text-white">{station.code}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-green-400" />
                                <span className="font-medium text-white">{station.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2 text-slate-300">
                                <Building2 className="w-4 h-4" />
                                {station.city}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2 text-slate-300">
                                <Calendar className="w-4 h-4" />
                                {station.created_at ? new Date(station.created_at).toLocaleDateString() : "--"}
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  onClick={() =>
                                    navigate({
                                      to: "/admin/stations/$stationId/edit",
                                      params: { stationId: station.id.toString() },
                                    })
                                  }
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:bg-blue-500/10"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  onClick={() => setDeleteConfirm(station.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:bg-red-500/10"
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
                    {stations.map((station, index) => (
                      <motion.div 
                        key={station.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-slate-800/30 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 font-medium text-white">
                              <MapPin className="w-4 h-4 text-green-400" />
                              {station.name}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Code className="w-3 h-3" />
                              {station.code}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Building2 className="w-3 h-3" />
                              {station.city}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() =>
                                navigate({
                                  to: "/admin/stations/$stationId/edit",
                                  params: { stationId: station.id.toString() },
                                })
                              }
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:bg-blue-500/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              onClick={() => setDeleteConfirm(station.id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
                  Are you sure you want to delete this station? This action cannot be undone.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => setDeleteConfirm(null)} 
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => confirmDelete(deleteConfirm)} 
                    variant="error"
                  >
                    Delete
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