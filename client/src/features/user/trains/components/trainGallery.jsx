import { useEffect, useRef, useCallback } from "react";
import { useTrains } from "../hooks/useTrains";
import { useSearch, Link } from "@tanstack/react-router";

const dummyTrain = {
  id: 1,
  name: "Train 1",
  code: "T1",
  departure_date: "2023-01-01",
  departure_time: "10:00",
  arrival_time: "11:00",
};

export default function TrainsGallery() {
  const search = useSearch({ from: "/(user)/trains/" });
  const { trains, isLoading, error, isSuccess, setSearchFilters } = useTrains({
    from: search.from,
    to: search.to,
    date: search.date,
    class: search.class,
  });
  const hasShownToast = useRef(false);
  const previousSearchParams = useRef({});

  useEffect(() => {
    setSearchFilters(search);
  }, [setSearchFilters, search]);

  const showToast = useCallback(() => {
    const toast = document.createElement("div");
    toast.className = "toast toast-top toast-end";
    toast.innerHTML = `
      <div class="alert alert-warning">
        <span>⚠️ No trains found for this route</span>
      </div>
    `;
    document.body.appendChild(toast);

    // Remove toast after 4 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
        hasShownToast.current = false;
      }
    }, 4000);
  }, []);

  // Show toast when search is successful but no trains found
  useEffect(() => {
    const currentSearch = { from: search.from, to: search.to, date: search.date, class: search.class };
    const hasSearchChanged = 
      previousSearchParams.current.from !== currentSearch.from ||
      previousSearchParams.current.to !== currentSearch.to ||
      previousSearchParams.current.date !== currentSearch.date ||
      previousSearchParams.current.class !== currentSearch.class;

    if (
      isSuccess &&
      trains.length === 0 &&
      !hasShownToast.current &&
      search.from &&
      search.to &&
      search.date &&
      hasSearchChanged
    ) {
      hasShownToast.current = true;
      showToast();
    }

    // Update previous search params after checking
    if (hasSearchChanged) {
      previousSearchParams.current = currentSearch;
    }
  }, [isSuccess, trains.length, search.from, search.to, search.date, search.class, showToast]);

  return (
    trains.length > 0 && (
      <div className="card w-11/12 h-full p-4 flex-3 flex flex-col shadow-2xl bg-base-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="ml-2">Loading trains...</span>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span>Error loading trains: {error.message}</span>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-scroll">
              {trains.map((train) => (
                <TrainCard key={train.id} train={train} />
              ))}
            </div>
            {/* Top fade */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-base-100 to-transparent z-10" />

            {/* Bottom fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-base-100 to-transparent z-10" />
          </div>
        )}
      </div>
    )
  );
}

const TrainCard = ({ train }) => {
  const search = useSearch({ from: "/(user)/trains/" });
  return (
    <div className="card h-56 w-full max-w-sm flex flex-col justify-between items-center bg-base-200">
      <div className="card-body flex flex-col justify-between items-center w-full">
        <div className="w-full flex justify-between items-center gap-4">
          <h2 className="card-title text-base">{train.name}</h2>
          <span className="px-4 py-1 text-sm rounded-3xl bg-accent">
            {train.code}
          </span>
        </div>
        <div className="w-full flex flex-col justify-between items-start gap-2">
          <hr className="w-full border-t-2 border-base-content/20" />
          <p className="w-full flex justify-between items-center text-sm">
            <span className="font-bold">Departure:</span>{" "}
            <span>{train.departure_time}</span>
          </p>
          <p className="w-full flex justify-between items-center text-sm">
            <span className="font-bold">Arrival:</span>{" "}
            <span>{train.arrival_time}</span>
          </p>
        </div>
        <div className="card-actions w-full">
          <Link
            to={`/trains/${train.id}/book`}
            search={{
              scheduleStopId: train.schedule_stop_id,
            }}
            className="btn btn-sm btn-primary w-full"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};
