import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearch } from "@tanstack/react-router";
import { useStations } from "../hooks/useStations";
import { useCoachTypes } from "../hooks/useCoachTypes";
import { useTrainFilters } from "../hooks/useTrainFilters";
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "../../../../components/LoadingSkeleton";

// ---------------------------
// Schema
// ---------------------------
const searchSchema = z.object({
  from: z.string().min(1, "From is required"),
  to: z.string().min(1, "To is required"),
  date: z.string().min(1, "Date is required"),
  class: z.string().optional(),
});

// ---------------------------
// Component
// ---------------------------
export default function TrainSearchForm() {
  const router = useRouter();
  const search = useSearch({ from: "/(user)/trains/" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { stations, isLoading: stationsLoading } = useStations();
  const { coachTypes, isLoading: coachTypesLoading } = useCoachTypes();
  const { updateFilters } = useTrainFilters();

  // ---------------------------
  // Form Setup
  // ---------------------------
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: search,
  });

  // ---------------------------
  // Sync URL → Form (only on initial load and URL changes)
  // ---------------------------
  useEffect(() => {
    if (stationsLoading || coachTypesLoading) return;
    reset({
      from: search.from ?? "",
      to: search.to ?? "",
      date: search.date ?? "",
      class: search.class ?? "",
    });

    // Only update filters if we have search params from URL
    if (search.from && search.to && search.date) {
      updateFilters({
        from: search.from,
        to: search.to,
        date: search.date,
        class: search.class,
      });
    }
  }, [search, stationsLoading, coachTypesLoading, reset, updateFilters]);

  // ---------------------------
  // Form Submit - Update URL and filters only on submit
  // ---------------------------
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Update filters
      updateFilters(data);

      // Update URL
      router.navigate({
        to: `/trains/`,
        search: {
          from: data.from,
          to: data.to,
          date: data.date,
          class: data.class || undefined,
        },
        replace: true,
      });
    } finally {
      // Add a small delay to show loading state
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  // Show loading skeleton if initial data is still loading
  if (stationsLoading || coachTypesLoading) {
    return <LoadingSkeleton type="train-search-form" />;
  }

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <div className="card w-full h-full flex-1 shadow-2xl bg-base-100">
      <div className="card-body flex flex-col items-center justify-evenly">
        <h2 className="text-3xl font-bold text-center mb-6">Search Train</h2>

        <form
          className="w-full flex flex-col justify-evenly space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* From */}
          <FormSelect
            label="From"
            name="from"
            register={register}
            options={stations}
            loading={stationsLoading}
            error={errors.from?.message}
            placeholder="Select departure station"
            disabled={isSubmitting}
          />

          {/* To */}
          <FormSelect
            label="To"
            name="to"
            register={register}
            options={stations}
            loading={stationsLoading}
            error={errors.to?.message}
            placeholder="Select destination station"
            disabled={isSubmitting}
          />

          {/* Date */}
          <FormInput
            label="Date of Journey"
            type="date"
            name="date"
            register={register}
            error={errors.date?.message}
            disabled={isSubmitting}
          />

          {/* Class */}
          <FormSelect
            label="Class (Optional)"
            name="class"
            register={register}
            options={coachTypes}
            loading={coachTypesLoading}
            placeholder="Any"
            disabled={isSubmitting}
          />

          {/* Submit */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary w-full ${
                isSubmitting ? "animate-pulse opacity-70" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Searching..." : "Search"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormSelect({
  label,
  name,
  register,
  options,
  loading,
  error,
  placeholder,
  disabled,
}) {
  return (
    <div className="space-y-2">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        className="select select-bordered w-full"
        {...register(name)}
        disabled={loading || disabled}
      >
        <option value="">{loading ? "Loading..." : placeholder}</option>
        {!loading && options?.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
      {error && <p className="label-text-alt text-error">{error}</p>}
    </div>
  );
}

function FormInput({ label, type, name, register, error, disabled }) {
  return (
    <div className="space-y-2">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        className="input input-bordered w-full"
        {...register(name)}
        disabled={disabled}
      />
      {error && <p className="label-text-alt text-error">{error}</p>}
    </div>
  );
}
