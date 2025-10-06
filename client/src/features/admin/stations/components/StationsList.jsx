import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useStations } from "../hooks/useStations.js";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import LoadingSkeleton from "../../../../components/LoadingSkeleton.jsx";

function StationsList() {
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

  // --- Local states for inputs (separate from hook filters) ---
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [cityFilter, setCityFilter] = useState(filters.city || "");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // --- Debounced search effect ---
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only call handleSearch if the input differs from current filter
      if (searchInput !== filters.search) {
        handleSearch(searchInput);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, handleSearch, filters.search]);

  // --- City filter handler ---
  const onCityFilterChange = (e) => {
    const value = e.target.value;
    setCityFilter(value);
    if (value !== filters.city) {
      handleCityFilter(value);
    }
  };

  // --- Delete confirmation ---
  const confirmDelete = async (stationId) => {
    const result = await handleDelete(stationId);
    if (result.success) {
      alert(result.message);
      setDeleteConfirm(null);
    } else {
      alert(result.message);
    }
  };

  // --- Unique cities for filter dropdown ---
  const uniqueCities = [...new Set(stations.map((s) => s.city).filter(Boolean))].sort();

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={refresh}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Station Management</h1>
          <p className="text-gray-600 mt-1">Manage railway stations</p>
        </div>
        <Button onClick={() => navigate({ to: "/admin/stations/new" })} className="bg-blue-600 hover:bg-blue-700">
          ➕ Add New Station
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Stations</label>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or code..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by City</label>
            <select
              value={cityFilter}
              onChange={onCityFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <Button
              onClick={() => {
                setSearchInput("");
                setCityFilter("");
                resetFilters();
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              🔄 Reset Filters
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.search || filters.city) && (
          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Active Filters:</span>
            {filters.search && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Search: "{filters.search}"</span>
            )}
            {filters.city && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">City: {filters.city}</span>
            )}
          </div>
        )}
      </Card>

      {/* Stations Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Found <span className="font-semibold text-gray-800">{stations.length}</span> stations
        </p>
      </div>

      {/* Stations Table */}
      {stations.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🚉</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Stations Found</h3>
          <p className="text-gray-500 mb-4">
            {filters.search || filters.city ? "Try adjusting your filters" : "Start by adding your first station"}
          </p>
          {!filters.search && !filters.city && (
            <Button onClick={() => navigate({ to: "/admin/stations/new" })} className="bg-blue-600 hover:bg-blue-700">
              Add First Station
            </Button>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {station.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{station.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">📍 {station.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(station.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => navigate({ to: `/admin/stations/${station.id}/edit` })}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-sm"
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirm(station.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this station? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <Button onClick={() => setDeleteConfirm(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-700">
                Cancel
              </Button>
              <Button onClick={() => confirmDelete(deleteConfirm)} className="bg-red-500 hover:bg-red-600 text-white">
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default StationsList;
