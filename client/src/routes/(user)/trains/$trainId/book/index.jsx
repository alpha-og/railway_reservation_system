import { createFileRoute, useSearch, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowRight, LogIn, UserPlus, XCircle } from "lucide-react";
import {
  TrainDetail,
  TrainSchedule,
  BookingProgress,
  StationSelector,
} from "../../../../../features/user/trains/components/";
import { useScheduleSummary } from "../../../../../features/user/trains/hooks/useScheduleSummary";
import { ErrorBoundary, PageLoadingSkeleton } from "../../../../../components/";
import { useAuthStore } from "../../../../../store/useAuthStore";

export const Route = createFileRoute("/(user)/trains/$trainId/book/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { trainId } = useParams({ from: "/(user)/trains/$trainId/book/" });
  const search = useSearch({ from: "/(user)/trains/$trainId/book/" });
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { scheduleSummary, isLoading, error } = useScheduleSummary(
    search.scheduleStopId,
  );

  // Show loading state for the entire page
  if (isLoading) {
    return <PageLoadingSkeleton />;
  }

  // Show error state
  if (error && !scheduleSummary) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="alert alert-error max-w-md shadow-lg">
              <XCircle className="stroke-current shrink-0 h-6 w-6" />
              <div>
                <h3 className="font-bold">
                  Unable to load booking information
                </h3>
                <div className="text-xs">{error.message}</div>
              </div>
            </div>
            <button
              className="btn btn-primary mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Page Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-2">
              Book Your Journey
            </h1>
            <p className="text-sm sm:text-base text-base-content/70 max-w-2xl mx-auto px-2">
              Review the train details and schedule below, then proceed to
              select your seats and complete your booking.
            </p>
          </div>

          {/* Booking Progress */}
          <div className="mb-6 sm:mb-8">
            <BookingProgress
              currentStep={1}
              train={scheduleSummary?.train}
              schedule={scheduleSummary?.schedule}
            />
          </div>

          {/* Main Content */}
          <div className="space-y-6 sm:space-y-8">
            {/* Train Details Section */}
            <section>
              <TrainDetail
                train={scheduleSummary?.train}
                schedule={scheduleSummary?.schedule}
                availableSeats={scheduleSummary?.availableSeats}
                isLoading={isLoading}
                error={error}
              />
            </section>

            {/* Station Selection Section */}
            <StationSelector
              currentFrom={search.from}
              currentTo={search.to}
              trainId={trainId}
              scheduleStopId={search.scheduleStopId}
            />

            {/* Schedule Section */}
            <section>
              <TrainSchedule
                schedule={scheduleSummary?.schedule}
                isLoading={isLoading}
                error={error}
              />
            </section>

            {/* Booking Actions */}
            {scheduleSummary?.train && (
              <section className="flex justify-center px-2">
                <div className="border card bg-base-100 shadow-xl max-w-2xl w-full">
                  <div className="card-body p-4 sm:p-6 text-center">
                    <h2 className="card-title justify-center text-lg sm:text-xl mb-3 sm:mb-4">
                      Ready to book?
                    </h2>
                    <p className="text-sm sm:text-base text-base-content/70 mb-4 sm:mb-6">
                      {token
                        ? "Click below to proceed with seat selection and passenger details"
                        : "Sign in to your account to proceed with booking"}
                    </p>
                    <div className="card-actions justify-center">
                      {token ? (
                        <button
                          className="btn btn-primary btn-lg w-full sm:w-auto"
                          onClick={() => {
                            navigate({
                              to: "/trains/$trainId/book/passengers",
                              params: { trainId: scheduleSummary.train.id },
                              search: {
                                scheduleId: scheduleSummary.schedule.id,
                                from: search.from,
                                to: search.to,
                              }
                            });
                          }}
                        >
                          <ArrowRight className="h-5 w-5 mr-2" />
                          Continue to Book
                        </button>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                          <Link
                            to="/signin"
                            className="btn btn-primary btn-lg flex-1 sm:flex-none"
                          >
                            <LogIn className="h-5 w-5 mr-2" />
                            Sign In to Book
                          </Link>
                          <Link
                            to="/signup"
                            className="btn btn-outline btn-lg flex-1 sm:flex-none"
                          >
                            <UserPlus className="h-5 w-5 mr-2" />
                            Sign Up
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
