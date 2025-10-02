import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearch } from "@tanstack/react-router";
import { useStations } from "../hooks/useStations";
import { useCoachTypes } from "../hooks/useCoachTypes";
import { useTrainFilters } from "../hooks/useTrainFilters";
import { useEffect, useState } from "react";
import { LoadingSkeleton } from "../../../../components/LoadingSkeleton";
import { Button, Card, FormInput, FormSelect } from "../../../../components/ui";

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
    <Card className="w-full h-full flex-1 shadow-2xl">
      <div className="flex flex-col items-center justify-evenly space-y-6">
        <h2 className="text-3xl font-bold text-center">Search Train</h2>

        <form
          className="w-full flex flex-col justify-evenly space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormSelect
            label="From"
            name="from"
            register={register}
            options={stations}
            loading={stationsLoading}
            error={errors.from}
            placeholder="Select departure station"
            disabled={isSubmitting}
          />

          <FormSelect
            label="To"
            name="to"
            register={register}
            options={stations}
            loading={stationsLoading}
            error={errors.to}
            placeholder="Select destination station"
            disabled={isSubmitting}
          />

          <FormInput
            label="Date of Journey"
            type="date"
            name="date"
            register={register}
            error={errors.date}
            disabled={isSubmitting}
          />

          <FormSelect
            label="Class (Optional)"
            name="class"
            register={register}
            options={coachTypes}
            loading={coachTypesLoading}
            placeholder="Any"
            disabled={isSubmitting}
          />

          <div className="form-control mt-6">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Search
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
