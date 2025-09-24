import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useStations } from "../hooks/useStations";
import { useCoachTypes } from "../hooks/useCoachTypes";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(searchSchema) });

  const onSubmit = (data) => {
    router.navigate({
      to: `/trains/search`,
      search: {
        from: data.from,
        to: data.to,
        date: data.date,
        class: data.class || undefined,
      },
    });
  };

  return (
    <div className="card w-full max-w-md shadow-2xl bg-base-100">
      <div className="card-body">
        <h2 className="text-3xl font-bold text-center mb-6">Search Train</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* From */}
          <div>
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
                <option key={station.id} value={station.name}>
                  {station.name}
                </option>
              ))}
            </select>
            {errors.from && (
              <p className="label-text-alt text-error">{errors.from.message}</p>
            )}
          </div>

          {/* To */}
          <div>
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
                <option key={station.id} value={station.name}>
                  {station.name}
                </option>
              ))}
            </select>
            {errors.to && (
              <p className="label-text-alt text-error">{errors.to.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
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
          <div>
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
                <option key={coachType.id} value={coachType.name}>
                  {coachType.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary w-full">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
