import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useStations } from "../hooks/useStations.js";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import LoadingSkeleton from "../../../../components/LoadingSkeleton.jsx";

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
  const [deleteMessage, setDeleteMessage] = useState(""); // Inline feedback

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
      setDeleteMessage("✅ " + result.message);
      setDeleteConfirm(null);
      setTimeout(() => setDeleteMessage(""), 2000);
    } else {
      setDeleteMessage("❌ " + result.message);
      setDeleteConfirm(null);
    }
  };

  const uniqueCities = [...new Set(stations.map((s) => s.city).filter(Boolean))].sort();

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#191922]">
        <Card className="p-10 max-w-lg rounded-2xl shadow-xl text-center bg-[#23232e] text-yellow-100">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-yellow-200 mb-2">Error</h2>
          <p className="text-yellow-300 mb-4">{error}</p>
          <Button onClick={refresh} className="bg-yellow-700 text-yellow-50 px-4 py-2 rounded-lg shadow hover:bg-yellow-800">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191922] py-12">
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto px-4">
        <div>
          <h1 className="text-4xl font-bold text-yellow-100">Station Management</h1>
          <p className="text-yellow-400 mt-2">Manage railway stations</p>
        </div>
        <Button onClick={() => navigate({ to: "/admin/stations/new" })}
          className="bg-yellow-700 hover:bg-yellow-800 text-yellow-50 font-semibold px-6 py-3 rounded-xl shadow">
          ➕ Add New Station
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-8 mb-8 max-w-6xl mx-auto rounded-2xl bg-[#23232e] shadow text-yellow-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-base font-semibold text-yellow-300 mb-2">Search Stations</label>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or code..."
              className="w-full px-4 py-3 border border-yellow-900 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg bg-[#191922] text-yellow-100"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-yellow-300 mb-2">Filter by City</label>
            <select
              value={cityFilter}
              onChange={onCityFilterChange}
              className="w-full px-4 py-3 border border-yellow-900 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg bg-[#191922] text-yellow-100"
            >
              <option value="">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchInput("");
                setCityFilter("");
                resetFilters();
              }}
              className="w-full bg-[#1a1a23] hover:bg-yellow-900 text-yellow-200 rounded-lg shadow"
            >
              🔄 Reset Filters
            </Button>
          </div>
        </div>
        {(filters.search || filters.city) && (
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="text-base text-yellow-300 font-medium">Active Filters:</span>
            {filters.search && (
              <span className="px-4 py-1 bg-yellow-900 text-yellow-100 rounded-full text-base">Search: "{filters.search}"</span>
            )}
            {filters.city && (
              <span className="px-4 py-1 bg-yellow-800 text-yellow-50 rounded-full text-base">City: {filters.city}</span>
            )}
          </div>
        )}
      </Card>

      {/* Stations Count */}
      <div className="max-w-6xl mx-auto px-4 mb-5">
        <p className="text-yellow-300 text-lg">
          Found <span className="font-bold text-yellow-100">{stations.length}</span> station{stations.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* Inline action feedback */}
      {deleteMessage && (
        <div className={`max-w-6xl mx-auto px-4 py-2 mb-6 text-center rounded-lg font-semibold shadow
          ${deleteMessage.startsWith("✅") ? "text-green-400 bg-green-950" : "text-red-400 bg-red-950"}`}>
          {deleteMessage}
        </div>
      )}

      {/* Stations Table */}
      {stations.length === 0 ? (
        <Card className="p-16 text-center max-w-3xl mx-auto rounded-2xl bg-[#23232e] shadow text-yellow-100">
          <div className="text-6xl mb-4">🚉</div>
          <h3 className="text-2xl font-semibold text-yellow-200 mb-2">No Stations Found</h3>
          <p className="text-yellow-300 mb-4">
            {filters.search || filters.city ? "Try adjusting your filters" : "Start by adding your first station"}
          </p>
          {!filters.search && !filters.city && (
            <Button onClick={() => navigate({ to: "/admin/stations/new" })} className="bg-yellow-700 hover:bg-yellow-800 text-yellow-50 font-semibold px-6 py-3 rounded-xl shadow">
              Add First Station
            </Button>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden max-w-6xl mx-auto rounded-2xl bg-[#23232e] shadow text-yellow-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-yellow-900">
              <thead className="bg-[#191922]">
                <tr>
                  <th className="px-6 py-4 text-left text-base font-semibold text-yellow-300 uppercase tracking-wider">Station Code</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-yellow-300 uppercase tracking-wider">Station Name</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-yellow-300 uppercase tracking-wider">City</th>
                  <th className="px-6 py-4 text-left text-base font-semibold text-yellow-300 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-4 text-right text-base font-semibold text-yellow-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-[#23232e] divide-y divide-yellow-900">
                {stations.map((station) => (
                  <tr key={station.id} className="hover:bg-[#1a1a23] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-4 py-1 inline-flex text-base leading-5 font-semibold rounded-full bg-yellow-900 text-yellow-100">
                        {station.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-medium text-yellow-200">{station.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg text-yellow-300">📍 {station.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg text-yellow-300">
                      {station.created_at ? new Date(station.created_at).toLocaleDateString() : "--"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                      <div className="flex justify-end gap-3">
                        <Button
                          onClick={() =>
                            navigate({
                              to: "/admin/stations/$stationId/edit",
                              params: { stationId: station.id.toString() },
                            })
                          }
                          className="bg-yellow-700 hover:bg-yellow-800 text-yellow-50 px-4 py-2 rounded-lg shadow"
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirm(station.id)}
                          className="bg-red-600 hover:bg-red-700 text-yellow-50 px-4 py-2 rounded-lg shadow"
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <Card className="p-8 max-w-md mx-4 rounded-2xl shadow-xl text-center bg-[#23232e] text-yellow-100">
            <h3 className="text-2xl font-bold text-yellow-200 mb-4">Confirm Delete</h3>
            <p className="text-yellow-300 mb-6">Are you sure you want to delete this station? This action cannot be undone.</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setDeleteConfirm(null)} className="bg-[#1a1a23] hover:bg-yellow-900 text-yellow-200 rounded-lg px-4 py-2">
                Cancel
              </Button>
              <Button onClick={() => confirmDelete(deleteConfirm)} className="bg-red-600 hover:bg-red-700 text-yellow-50 rounded-lg px-4 py-2">
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}