import { safeGet } from "../../../../lib/dataUtils";

const BookingProgress = ({ currentStep = 1, train = null }) => {
  const steps = [
    { id: 1, name: 'Review Journey', description: 'Train & Schedule Details' },
    { id: 2, name: 'Passenger Info', description: 'Details & Coach Selection' },
    { id: 3, name: 'Payment', description: 'Complete Booking' }
  ];

  const trainName = safeGet(train, 'name', 'Train');
  const trainCode = safeGet(train, 'code', '');

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body py-4 sm:py-6 px-3 sm:px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold">Booking Progress</h3>
              {train && (
                <p className="text-xs sm:text-sm text-base-content/70">
                  {trainName} {trainCode && `(${trainCode})`}
                </p>
              )}
            </div>
            <div className="badge badge-primary badge-sm sm:badge-lg">
              Step {currentStep} of {steps.length}
            </div>
          </div>

          {/* Progress Steps */}
          <ul className="steps steps-vertical sm:steps-horizontal w-full">
            {steps.map((step) => (
              <li 
                key={step.id}
                className={`step ${currentStep >= step.id ? 'step-primary' : ''}`}
                data-content={currentStep > step.id ? '✓' : step.id}
              >
                <div className="text-left">
                  <div className="font-medium text-sm sm:text-base">{step.name}</div>
                  <div className="text-xs text-base-content/60 hidden sm:block">{step.description}</div>
                </div>
              </li>
            ))}
          </ul>

          {/* Current Step Info */}
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-base-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium">
                {steps[currentStep - 1]?.name}: {steps[currentStep - 1]?.description}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingProgress;