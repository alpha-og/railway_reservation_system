import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getTrainById } from "../services/trainService";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useNavigate } from "@tanstack/react-router";

export default function TrainDetail() {
  const { trainId } = useParams({ from: "/(user)/trains/$trainId/details" });
  const [train, setTrain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3); // countdown for redirect
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Fetch train details
  useEffect(() => {
    setLoading(true);
    getTrainById(trainId)
      .then((data) => setTrain(data))
      .finally(() => setLoading(false));
  }, [trainId]);

  // Handle redirect countdown
  useEffect(() => {
    if (!redirecting) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate({ to: "/signin", replace: true }); // ✅ correct TanStack Router usage
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirecting, navigate]);

  const handleBookNow = () => {
    if (!user) {
      setRedirecting(true);
    } else {
      navigate({ to: `/trains/${train.code}/book/new` }); // ✅ correct
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading train details...</p>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-error text-lg font-semibold">Train not found!</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-6">
      <div className="card w-full max-w-2xl bg-base-100 shadow-2xl">
        <div className="card-body">
          {/* Header */}
          <h2 className="card-title text-3xl font-bold mb-4">{train.name}</h2>
          <p className="text-sm text-gray-500 mb-6">Train No: {train.code}</p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <span className="font-semibold">Source:</span> {train.source}
              </p>
              <p>
                <span className="font-semibold">Departure:</span> {train.departureTime}
              </p>
              <p>
                <span className="font-semibold">Duration:</span> {train.duration}
              </p>
            </div>
            <div>
              <p>
                <span className="font-semibold">Destination:</span> {train.destination}
              </p>
              <p>
                <span className="font-semibold">Arrival:</span> {train.arrivalTime}
              </p>
              <p>
                <span className="font-semibold">Classes:</span> {train.classes?.join(", ")}
              </p>
            </div>
          </div>

          {/* Message */}
          {redirecting && (
            <p className="text-yellow-400 font-semibold mt-4">
              You are not signed in. Redirecting to Sign In in {countdown}...
            </p>
          )}

          {/* Actions */}
          <div className="card-actions justify-end mt-6">
            <button
              onClick={() => navigate({ to: "/trains" })}
              className="btn btn-outline"
            >
              Back to Train List
            </button>
            <button
              onClick={() => navigate({ to: `/trains/${train.code}/schedule` })}
              className="btn btn-info"
            >
              View Schedule
            </button>
            <button
              onClick={handleBookNow}
              className="btn btn-primary"
              disabled={redirecting}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
