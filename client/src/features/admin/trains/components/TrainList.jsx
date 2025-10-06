import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Train, 
  Search, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Sparkles,
  Code,
  Eye,
  Calendar
} from "lucide-react";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import { Input } from "../../../../components/ui/index.js";
import { LoadingSkeleton } from "../../../../components/LoadingSkeleton.jsx";
import trainAdminService from "../services/trainAdmin.service";

export default function TrainList() {
  const [trains, setTrains] = useState([]);
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrains();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = trains.filter(train =>
        train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        train.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTrains(filtered);
    } else {
      setFilteredTrains(trains);
    }
  }, [trains, searchTerm]);

  async function fetchTrains() {
    setLoading(true);
    setError("");
    try {
      const response = await trainAdminService.getTrains();
      setTrains(response);
      setFilteredTrains(response);
    } catch {
      setError("Failed to load trains.");
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (trainId) => {
    setLoading(true);
    setError("");
    setActionMessage("");
    try {
      await trainAdminService.deleteTrain(trainId);
      setTrains((prev) => prev.filter((t) => t.id !== trainId));
      setActionMessage("Train deleted successfully!");
      setDeleteConfirm(null);
      setTimeout(() => setActionMessage(""), 3000);
    } catch {
      setActionMessage("Failed to delete train. Please try again.");
      setDeleteConfirm(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading && trains.length === 0) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="max-w-lg mx-auto bg-white/5 backdrop-blur-sm border-white/10">
          <div className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-bold mb-4 text-white">Error</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <Button onClick={fetchTrains} variant="primary">
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
                <Train className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Train Management</h1>
                <p className="text-slate-400">Manage trains and configurations</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate({ to: "/admin/trains/create" })}
              variant="success"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Train
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

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6 bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Search & Filter</h2>
                <Button 
                  onClick={fetchTrains}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search trains by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              {searchTerm && (
                <div className="mt-4 flex gap-2 flex-wrap">
                  <span className="text-sm text-slate-300 font-medium">Active Search:</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    "{searchTerm}"
                  </span>
                  <Button
                    onClick={() => setSearchTerm("")}
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Trains List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <div className="p-6">
              {filteredTrains.length === 0 ? (
                <div className="text-center py-12">
                  <Train className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-xl font-medium text-slate-300 mb-2">
                    {searchTerm ? "No trains match your search" : "No trains found"}
                  </h3>
                  <p className="text-slate-400 mb-6">
                    {searchTerm 
                      ? "Try adjusting your search terms or clear the search." 
                      : "Get started by creating your first train."}
                  </p>
                  {!searchTerm && (
                    <Button 
                      onClick={() => navigate({ to: "/admin/trains/create" })}
                      variant="success"
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create First Train
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                      <h2 className="text-xl font-semibold text-white">
                        {filteredTrains.length} Train{filteredTrains.length !== 1 ? 's' : ''}
                        {searchTerm && ` matching "${searchTerm}"`}
                      </h2>
                    </div>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-4 px-4 text-slate-300 font-medium">Train Code</th>
                          <th className="text-left py-4 px-4 text-slate-300 font-medium">Train Name</th>
                          <th className="text-left py-4 px-4 text-slate-300 font-medium">Status</th>
                          <th className="text-right py-4 px-4 text-slate-300 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTrains.map((train, index) => (
                          <motion.tr 
                            key={train.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-blue-400" />
                                <span className="font-mono font-medium text-white">{train.code}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Train className="w-4 h-4 text-green-400" />
                                <span className="font-medium text-white">{train.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-400" />
                                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                                  Active
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  onClick={() =>
                                    navigate({
                                      to: "/admin/trains/$trainId/view",
                                      params: { trainId: train.id.toString() },
                                    })
                                  }
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:bg-blue-500/10"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  onClick={() =>
                                    navigate({
                                      to: "/admin/trains/$trainId/edit",
                                      params: { trainId: train.id.toString() },
                                    })
                                  }
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-400 hover:bg-green-500/10"
                                  title="Edit Train"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  onClick={() => setDeleteConfirm(train.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:bg-red-500/10"
                                  title="Delete Train"
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
                    {filteredTrains.map((train, index) => (
                      <motion.div 
                        key={train.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 bg-slate-800/30 rounded-lg border border-slate-700"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 font-medium text-white">
                              <Train className="w-4 h-4 text-green-400" />
                              {train.name}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Code className="w-3 h-3" />
                              {train.code}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                                Active
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() =>
                                navigate({
                                  to: "/admin/trains/$trainId/view",
                                  params: { trainId: train.id.toString() },
                                })
                              }
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:bg-blue-500/10"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              onClick={() =>
                                navigate({
                                  to: "/admin/trains/$trainId/edit",
                                  params: { trainId: train.id.toString() },
                                })
                              }
                              variant="ghost"
                              size="sm"
                              className="text-green-400 hover:bg-green-500/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              onClick={() => setDeleteConfirm(train.id)}
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
                  Are you sure you want to delete this train? This action cannot be undone and will remove all associated coaches and seats.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => setDeleteConfirm(null)} 
                    variant="ghost"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => handleDelete(deleteConfirm)} 
                    variant="error"
                    loading={loading}
                  >
                    {loading ? "Deleting..." : "Delete Train"}
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