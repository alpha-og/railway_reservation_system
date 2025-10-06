import { useEffect, useMemo } from "react";
import { useParams, useSearch, useNavigate } from "@tanstack/react-router";
import { ErrorBoundary } from "../../../../components";
import { FormField, FormInput, FormSelect, Button } from "../../../../components/ui";
import { BookingProgress } from "./index";
import { CheckCircle, XCircle, Trash2, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { useSavedPassengers, usePassengerForm } from "../hooks/usePassengers";
import { useCoachTypes, useScheduleAvailability } from "../hooks/useCoachData";
import { useTrainBooking } from "../hooks/useTrainBooking";
import coachTypeService from "../services/coachType.service";

export default function PassengersPage() {
  const { trainId } = useParams({ from: "/(user)/trains/$trainId/book/passengers" });
  const search = useSearch({ from: "/(user)/trains/$trainId/book/passengers" });
  const navigate = useNavigate();

  // Initialize passengers from search params
  const initialPassengers = search.passengers 
    ? JSON.parse(search.passengers) 
    : [];

  // Custom hooks for data and state management
  const { savedPassengers, isLoading: loadingPassengers, isError: savedPassengersError, isFallback } = useSavedPassengers();
  const { isLoading: loadingCoachTypes, getCoachPrice, getCoachTypeName, getCoachTypeOptions } = useCoachTypes();
  const { availabilityData } = useScheduleAvailability(search.scheduleId);

  // Booking hook
  const { 
    booking, 
    error: bookingError, 
    isSuccess: bookingSuccess, 
    isLoading: isCreatingBooking, 
    createBooking 
  } = useTrainBooking();

  // Get available coach type options for this schedule
  const availableCoachOptions = useMemo(() => 
    getCoachTypeOptions(availabilityData), 
    [getCoachTypeOptions, availabilityData]
  );

  // Passenger form management
  const {
    passengers,
    errors,
    isSubmitting,
    showSuccess,
    addPassenger,
    removePassenger,
    updatePassenger,
    autofillPassenger,
    validateForm,
    setSubmitting,
    setSuccess,
  } = usePassengerForm(initialPassengers, availableCoachOptions);

  // Sync passengers into search params
  useEffect(() => {
    navigate({
      search: (prev) => ({
        ...prev,
        passengers: JSON.stringify(passengers),
      }),
      replace: true,
    });
  }, [passengers, navigate]);

  // Handle passenger autofill
  const handleAutofillPassenger = (index, passengerId) => {
    if (!savedPassengers || !Array.isArray(savedPassengers)) {
      return;
    }
    
    const selected = savedPassengers.find((p) => p.id === passengerId);
    
    if (selected) {
      autofillPassenger(index, selected);
    }
  };

  // Handle booking success
  useEffect(() => {
    if (bookingSuccess && booking) {
      setSuccess(true);
      setTimeout(() => {
        navigate({
          to: "/trains/$trainId/book/payment",
          params: { trainId },
          search: {
            scheduleId: search.scheduleId,
            from: search.from,
            to: search.to,
            passengers: JSON.stringify(passengers),
            bookingId: booking.id,
          },
        });
      }, 800);
    }
  }, [bookingSuccess, booking, navigate, trainId, search, passengers, setSuccess]);

  // Handle booking error
  useEffect(() => {
    if (bookingError) {
      setSubmitting(false);
    }
  }, [bookingError, setSubmitting]);

  // Handle form submission
  const handleSubmit = async () => {
    setSubmitting(true);
    
    if (!validateForm()) {
      setSubmitting(false);
      return;
    }

    // Calculate total amount
    const totalAmount = passengers.reduce((total, p) => total + getCoachPrice(p.coachType), 0);

    // Prepare booking data
    const bookingData = {
      scheduleId: search.scheduleId,
      fromStationId: search.from,
      toStationId: search.to,
      totalAmount,
      passengers: passengers.map(passenger => ({
        name: passenger.name,
        age: parseInt(passenger.age),
        gender: passenger.gender,
        coachType: passenger.coachType,
        email: passenger.email?.trim() || ''
      }))
    };

    try {
      await createBooking(bookingData);
    } catch (error) {
      setSubmitting(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Page Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-2">
              Passenger Details
            </h1>
            <p className="text-sm sm:text-base text-base-content/70 max-w-2xl mx-auto px-2">
              Please provide details for all passengers traveling on this journey.
            </p>
          </div>

          {/* Booking Progress */}
          <div className="mb-6 sm:mb-8">
            <BookingProgress currentStep={2} />
          </div>

          {/* Train Info */}
          <div className="card bg-base-200 shadow-sm mb-6 sm:mb-8">
            <div className="card-body py-3 sm:py-4 px-3 sm:px-6">
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                <span className="badge badge-outline">Train ID: {trainId}</span>
                <span className="badge badge-outline">Schedule: {availabilityData?.data?.schedule?.id || search.scheduleId}</span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="alert alert-success mb-6 animate-pulse">
              <CheckCircle className="stroke-current shrink-0 h-6 w-6" />
              <span className="text-sm sm:text-base">Passenger details validated successfully! Redirecting to payment...</span>
            </div>
          )}

          {/* General Error */}
          {(errors.general || bookingError) && (
            <div className="alert alert-error mb-6">
              <XCircle className="stroke-current shrink-0 h-6 w-6" />
              <span className="text-sm sm:text-base">{errors.general || bookingError?.message || "An error occurred while creating the booking"}</span>
            </div>
          )}

          {/* Saved Passengers Error */}
          {savedPassengersError && (
            <div className="alert alert-warning mb-6">
              <XCircle className="stroke-current shrink-0 h-6 w-6" />
              <span className="text-sm sm:text-base">
                Unable to load saved passengers. {isFallback ? "Using demo data." : "You can still enter passenger details manually."}
              </span>
            </div>
          )}

          {/* Passenger Forms */}
          <div className="space-y-4 sm:space-y-6">
            {passengers.map((passenger, index) => (
              <div key={index} className="card bg-base-100 shadow-xl">
                <div className="card-body p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-4">
                    <h3 className="card-title text-lg sm:text-xl">
                      Passenger {index + 1}
                    </h3>
                    {passengers.length > 0 && (
                      <button
                        type="button"
                        onClick={() => removePassenger(index)}
                        className="btn btn-error btn-sm"
                        disabled={isSubmitting || isCreatingBooking}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="ml-2">Remove</span>
                      </button>
                    )}
                  </div>

                  {/* Saved Passenger Selection */}
                  {(loadingPassengers || (savedPassengers && savedPassengers.length > 0)) && (
                    <FormField label="Quick Fill from Saved Passengers" className="mb-4">
                      <FormSelect
                        options={savedPassengers?.map(sp => ({
                          value: sp.id,
                          label: `${sp.name} (${sp.age} years, ${sp.gender})`
                        })) || []}
                        placeholder={loadingPassengers ? "Loading saved passengers..." : "-- Choose a saved passenger --"}
                        loading={loadingPassengers}
                        onChange={(e) => handleAutofillPassenger(index, e.target.value)}
                        disabled={isSubmitting || isCreatingBooking || loadingPassengers}
                      />
                    </FormField>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div className="sm:col-span-2">
                      <FormInput
                        label="Full Name" 
                        error={errors[index]?.name}
                        required
                        type="text"
                        className="text-sm sm:text-base"
                        value={passenger.name}
                        onChange={(e) => updatePassenger(index, "name", e.target.value)}
                        placeholder="Enter full name"
                        disabled={isSubmitting || isCreatingBooking}
                      />
                    </div>

                    {/* Email Field */}
                    <div className="sm:col-span-2">
                      <FormInput
                        label="Email" 
                        error={errors[index]?.email}
                        required
                        type="email"
                        className="text-sm sm:text-base"
                        value={passenger.email || ''}
                        onChange={(e) => updatePassenger(index, "email", e.target.value)}
                        placeholder="Enter email address"
                        disabled={isSubmitting || isCreatingBooking}
                      />
                      <div className="text-xs text-base-content/60 mt-1">
                        Email helps us match with your saved passenger details for future bookings
                      </div>
                    </div>

                    {/* Age Field */}
                    <FormInput
                      label="Age" 
                      error={errors[index]?.age}
                      required
                      type="number"
                      className="text-sm sm:text-base"
                      value={passenger.age}
                      onChange={(e) => updatePassenger(index, "age", e.target.value)}
                      placeholder="Age"
                      min="1"
                      max="120"
                      disabled={isSubmitting || isCreatingBooking}
                    />

                    {/* Gender Field */}
                    <FormSelect
                      label="Gender" 
                      error={errors[index]?.gender}
                      required
                      className="text-sm sm:text-base"
                      value={passenger.gender}
                      onChange={(e) => updatePassenger(index, "gender", e.target.value)}
                      disabled={isSubmitting || isCreatingBooking}
                      placeholder="Select gender"
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                        { value: "Other", label: "Other" }
                      ]}
                    />

                    {/* Coach Type Field */}
                    <div className="sm:col-span-2">
                      <FormSelect
                        label="Coach Type" 
                        error={errors[index]?.coachType}
                        required
                        className="text-sm sm:text-base"
                        value={passenger.coachType}
                        onChange={(e) => updatePassenger(index, "coachType", e.target.value)}
                        disabled={isSubmitting || isCreatingBooking || loadingCoachTypes || availableCoachOptions.length === 0}
                        placeholder={loadingCoachTypes ? "Loading coach types..." : availableCoachOptions.length === 0 ? "No available coach types" : "Select coach type"}
                        loading={loadingCoachTypes}
                        options={availableCoachOptions}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Passenger Button */}
          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto" 
              onClick={addPassenger}
              disabled={isSubmitting || isCreatingBooking}
            >
              <Plus className="h-5 w-5 mr-2" />
              {passengers.length === 0 ? "Add Passenger" : "Add Another Passenger"}
            </Button>
          </div>

          {/* Booking Summary */}
          {passengers.length > 0 && (
            <div className="card bg-base-200 shadow-sm mt-6">
              <div className="card-body py-4 px-6">
                <h3 className="card-title text-lg mb-4">Booking Summary</h3>
                <div className="space-y-2">
                  {passengers.map((passenger, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{passenger.name || `Passenger ${index + 1}`} - {coachTypeService.normalizeCoachTypeName(getCoachTypeName(passenger.coachType))}</span>
                      <span className="font-medium">₹{getCoachPrice(passenger.coachType)}</span>
                    </div>
                  ))}
                  <div className="divider my-2"></div>
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total Cost</span>
                    <span>₹{passengers.reduce((total, p) => total + getCoachPrice(p.coachType), 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:gap-4 mt-6 sm:mt-8 px-2">
            <Button 
              variant="outline" 
              size="lg" 
              className="order-2 sm:order-1"
              onClick={() => {
                navigate({
                  to: "/trains/$trainId/book",
                  params: { trainId },
                  search: {
                    scheduleId: search.scheduleId,
                    from: search.from,
                    to: search.to,
                  }
                });
              }}
              disabled={isSubmitting || isCreatingBooking}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Back to Journey Details</span>
              <span className="sm:hidden">Back</span>
            </Button>
           
            <Button
              variant="primary"
              size="lg" 
              className={`order-1 sm:order-2 ${(isSubmitting || isCreatingBooking) ? 'loading' : ''}`}
              onClick={handleSubmit}
              disabled={isSubmitting || isCreatingBooking || passengers.length === 0}
            >
              {(isSubmitting || isCreatingBooking) ? (
                'Creating Booking...'
              ) : (
                <>
                  <span className="hidden sm:inline">Continue to Payment</span>
                  <span className="sm:hidden">Continue</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}