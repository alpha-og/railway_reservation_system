import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useStations } from "../hooks/useStations";
import { useCoachTypes } from "../hooks/useCoachTypes";
import { useTrainFilters } from "../hooks/useTrainFilters";

const searchSchema = z.object({
  from: z.string().min(1, "From is required"),
  to: z.string().min(1, "To is required"),
  date: z.string().min(1, "Date is required"),
  class: z.string().optional(),
});

export default function TrainSearchForm() {
  const router = useRouter();

  const { stations, isLoading: stationsLoading } = useStations();
  const { coachTypes, isLoading: coachTypesLoading } = useCoachTypes();
  const { filters, updateFilters } = useTrainFilters();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: filters,
  });

  const onSubmit = (data) => {
    updateFilters(data);
    router.navigate({
      to: `/trains/`,
      search: {
        from: data.from,
        to: data.to,
        date: data.date,
        class: data.class || undefined,
      },
    });
  };

  return (
    <div className="card w-full h-full max-w-md flex-1 shadow-2xl bg-base-100">
      <div className="card-body flex flex-col items-center justify-evenly">
        <h2 className="text-3xl font-bold text-center mb-6">Search Train</h2>

        <form
          className="w-full flex flex-col justify-evenly space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* From */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text">From</span>
            </label>
            <select
              className="select select-bordered w-full"
              {...register("from")}
              disabled={stationsLoading}
            >
              <option value="">Select departure station</option>
              {stations?.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
            {errors.from && (
              <p className="label-text-alt text-error">{errors.from.message}</p>
            )}
          </div>

          {/* To */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text">To</span>
            </label>
            <select
              className="select select-bordered w-full"
              {...register("to")}
              disabled={stationsLoading}
            >
              <option value="">Select destination station</option>
              {stations?.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
            {errors.to && (
              <p className="label-text-alt text-error">{errors.to.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text">Date of Journey</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              {...register("date")}
            />
            {errors.date && (
              <p className="label-text-alt text-error">{errors.date.message}</p>
            )}
          </div>

          {/* Class */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text">Class (Optional)</span>
            </label>
            <select
              className="select select-bordered w-full"
              {...register("class")}
              disabled={coachTypesLoading}
            >
              <option value="">Any</option>
              {coachTypes?.map((coachType) => (
                <option key={coachType.id} value={coachType.id}>
                  {coachType.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary w-full ${stationsLoading || coachTypesLoading ? "loading" : ""}`}
              disabled={stationsLoading || coachTypesLoading}
            >
              {stationsLoading || coachTypesLoading ? "Loading..." : "Search"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
