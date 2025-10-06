import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Button from "../../../../components/ui/Button.jsx";
import Card from "../../../../components/ui/Card.jsx";
import { getSchedules, deleteSchedule } from "../services/scheduleService.js";
import trainService from "../../../admin/trains/services/trainAdmin.service.js";

export default function ScheduleList() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    setLoading(true);
    getSchedules()
      .then(resp => {
        // Backend returns {success, data: [...]}
        console.log("DEBUG getSchedules resp:", resp);
        const allSchedules = resp.data || [];
        setSchedules(allSchedules);
        console.log("DEBUG schedules after extraction:", allSchedules);
      })
      .catch(() => setSchedules([]))
      .finally(() => setLoading(false));

    trainService.getTrains().then((resp) => {
      const trainArr = resp.data?.trains || resp.trains || resp || [];
      setTrains(trainArr);
      console.log("DEBUG trains:", trainArr);
    });
  }, [refresh]);

  const trainName = (id) => {
    const t = trains.find(t => t.id === id);
    return t ? `${t.name} (${t.code})` : id;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;
    setActionMessage("");
    try {
      const resp = await deleteSchedule(id);
      console.log("DEBUG delete resp:", resp);
      if (resp.success) {
        setActionMessage("✅ Schedule deleted.");
        setRefresh(r => r + 1);
      } else {
        setActionMessage("❌ Could not delete schedule.");
      }
    } catch (err) {
      setActionMessage("❌ " + (err.message || "Error occurred"));
    }
  };

  return (
    <div className="min-h-screen bg-[#191922] py-12">
      <div className="max-w-3xl mx-auto px-4 mb-8">
        <h1 className="text-4xl font-bold text-yellow-100 mb-2">Schedules</h1>
        <div className="flex gap-4 mb-6">
          <Button className="bg-green-700" onClick={() => navigate({ to: "/admin/schedules/create" })}>+ Create</Button>
        </div>
        {actionMessage && (
          <div className={`py-2 text-center rounded-lg font-semibold ${actionMessage.startsWith("✅") ? "text-green-400 bg-green-950" : "text-red-400 bg-red-950"}`}>
            {actionMessage}
          </div>
        )}
      </div>
      <Card className="p-6 max-w-3xl mx-auto rounded-2xl shadow-lg bg-[#23232e] text-yellow-100">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <div className="text-yellow-300">Loading schedules...</div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="text-center text-yellow-300 py-12">No schedules found.</div>
        ) : (
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-yellow-300 text-lg">
                <th>Date</th>
                <th>Time</th>
                <th>Train</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map(sched => (
                <tr key={sched.id} className="bg-[#191922]">
                  <td>{sched.departure_date}</td>
                  <td>{sched.departure_time}</td>
                  <td>{trainName(sched.train_id)}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button className="bg-yellow-700" onClick={() => navigate({ to: `/admin/schedules/${sched.id}/edit` })}>Edit</Button>
                      <Button className="bg-red-700" onClick={() => handleDelete(sched.id)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}