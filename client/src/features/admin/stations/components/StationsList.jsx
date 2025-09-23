import React from "react";
import { Link } from "@tanstack/react-router";
import { deleteStation } from "../services/stationService";
import { useStations } from "../hooks/useStations";

export default function StationsList() {
  const { data: stations = [], isLoading } = useStations();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this station?")) {
      try {
        await deleteStation(id);
        window.location.reload(); // for demo, you can optimize with local state
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return (
      <p className="text-center p-8">
        <span className="loading loading-spinner loading-lg"></span> Loading stations...
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Manage Stations</h2>
          <Link to="/admin/stations/new">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Add New Station
            </button>
          </Link>
        </div>

        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Code</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => (
              <tr key={station.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{station.id}</td>
                <td className="border border-gray-300 px-4 py-2">{station.name}</td>
                <td className="border border-gray-300 px-4 py-2">{station.code}</td>
                <td className="border border-gray-300 px-4 py-2 space-x-2">
                  <Link to={`/admin/stations/${station.id}/edit`}>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(station.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {stations.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No stations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
