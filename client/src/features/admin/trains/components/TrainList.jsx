import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import trainAdminService from "../services/trainAdmin.service";

export default function TrainList() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTrains() {
      setLoading(true);
      setError("");
      try {
        const response = await trainAdminService.getTrains();
        setTrains(response);
      } catch {
        setError("Failed to load trains.");
      } finally {
        setLoading(false);
      }
    }
    fetchTrains();
  }, []);

  const handleDelete = async (trainId) => {
    if (!window.confirm("Are you sure you want to delete this train?")) return;
    setLoading(true);
    setError("");
    try {
      await trainAdminService.deleteTrain(trainId);
      setTrains((prev) => prev.filter((t) => t.id !== trainId));
    } catch {
      setError("Failed to delete train.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Trains</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate({ to: "/admin/trains/create" })}
        >
          + Create Train
        </button>
      </div>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table w-full rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-900 text-yellow-300">
            <tr>
              <th className="py-2 px-4">Train Name</th>
              <th className="py-2 px-4">Train Code</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-950 text-yellow-100">
            {trains.map((train) => (
              <tr key={train.id} className="border-b border-gray-800 hover:bg-gray-900 transition">
                <td className="py-2 px-4">{train.name}</td>
                <td className="py-2 px-4">{train.code}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    className="btn btn-xs btn-info"
                    onClick={() =>
                      navigate({
                        to: "/admin/trains/$trainId/details",
                        params: { trainId: train.id },
                      })
                    }
                  >
                    Details
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleDelete(train.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {trains.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  No trains found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}