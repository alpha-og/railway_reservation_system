const CardSkeleton = ({ className = '' }) => (
  <div className={`card bg-base-100 shadow-xl animate-pulse ${className}`}>
    <div className="card-body">
      <div className="skeleton h-6 w-32 mb-4"></div>
      <div className="skeleton h-4 w-full mb-2"></div>
      <div className="skeleton h-4 w-3/4 mb-4"></div>
      <div className="flex justify-end gap-2">
        <div className="skeleton h-8 w-20"></div>
        <div className="skeleton h-8 w-24"></div>
      </div>
    </div>
  </div>
);

const TrainCardSkeleton = ({ className = '' }) => (
  <div className={`card h-56 w-full bg-base-200 animate-pulse flex flex-col min-w-0 ${className}`}>
    <div className="card-body flex flex-col justify-between h-full p-4">
      <div className="w-full flex justify-between items-start gap-4">
        <div className="skeleton h-5 w-24 flex-1 min-w-0"></div>
        <div className="skeleton h-6 w-16 rounded-full shrink-0"></div>
      </div>
      <div className="w-full flex flex-col gap-2 flex-1">
        <div className="skeleton h-px w-full"></div>
        <div className="space-y-1">
          <div className="w-full flex justify-between items-center">
            <div className="skeleton h-4 w-16"></div>
            <div className="skeleton h-4 w-12"></div>
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="skeleton h-4 w-12"></div>
            <div className="skeleton h-4 w-12"></div>
          </div>
        </div>
      </div>
      <div className="w-full pt-2">
        <div className="skeleton h-8 w-full"></div>
      </div>
    </div>
  </div>
);

const FormFieldSkeleton = () => (
  <div className="space-y-2">
    <div className="skeleton h-4 w-20"></div>
    <div className="skeleton h-12 w-full"></div>
  </div>
);

const TrainSearchFormSkeleton = ({ className = '' }) => (
  <div className={`card w-full h-full flex-1 shadow-2xl bg-base-100 animate-pulse ${className}`}>
    <div className="card-body flex flex-col items-center justify-evenly p-4">
      <div className="skeleton h-8 w-48 mb-6"></div>
      <div className="w-full flex flex-col justify-evenly space-y-4">
        {[...Array(4)].map((_, i) => (
          <FormFieldSkeleton key={i} />
        ))}
        <div className="mt-6">
          <div className="skeleton h-12 w-full"></div>
        </div>
      </div>
    </div>
  </div>
);

const TimelineItemSkeleton = () => (
  <div className="flex items-center gap-4 animate-pulse">
    <div className="skeleton h-4 w-4 rounded-full shrink-0"></div>
    <div className="flex-1">
      <div className="skeleton h-4 w-32 mb-2"></div>
      <div className="skeleton h-3 w-24"></div>
    </div>
    <div className="skeleton h-6 w-16"></div>
  </div>
);

const TimelineSkeleton = ({ className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {[...Array(5)].map((_, i) => (
      <TimelineItemSkeleton key={i} />
    ))}
  </div>
);

const StatItemSkeleton = () => (
  <div className="stat">
    <div className="skeleton h-4 w-20 mb-2"></div>
    <div className="skeleton h-8 w-16 mb-1"></div>
    <div className="skeleton h-3 w-24"></div>
  </div>
);

const StatsSkeleton = ({ className = '' }) => (
  <div className={`stats shadow animate-pulse ${className}`}>
    {[...Array(3)].map((_, i) => (
      <StatItemSkeleton key={i} />
    ))}
  </div>
);

const ListItemSkeleton = () => (
  <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg animate-pulse">
    <div className="skeleton h-8 w-8 rounded-full shrink-0"></div>
    <div className="flex-1">
      <div className="skeleton h-4 w-3/4 mb-1"></div>
      <div className="skeleton h-3 w-1/2"></div>
    </div>
  </div>
);

const ListSkeleton = ({ count = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(count)].map((_, i) => (
      <ListItemSkeleton key={i} />
    ))}
  </div>
);

const DefaultSkeleton = ({ className = '' }) => (
  <div className={`skeleton h-4 w-full ${className}`}></div>
);

const SKELETON_COMPONENTS = {
  card: CardSkeleton,
  'train-card': TrainCardSkeleton,
  'train-search-form': TrainSearchFormSkeleton,
  timeline: TimelineSkeleton,
  stats: StatsSkeleton,
  list: ListSkeleton,
  default: DefaultSkeleton,
};

export const LoadingSkeleton = ({ type = 'default', count = 1, className = '' }) => {
  const SkeletonComponent = SKELETON_COMPONENTS[type] || SKELETON_COMPONENTS.default;
  return <SkeletonComponent count={count} className={className} />;
};

export const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-base-100">
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8 animate-pulse">
        <div className="skeleton h-10 w-64 mx-auto mb-4"></div>
        <div className="skeleton h-4 w-96 mx-auto"></div>
      </div>
      <div className="space-y-8">
        <LoadingSkeleton type="card" className="max-w-4xl mx-auto" />
        <LoadingSkeleton type="timeline" className="max-w-4xl mx-auto" />
        <LoadingSkeleton type="stats" className="max-w-2xl mx-auto" />
      </div>
    </div>
  </div>
);

export default LoadingSkeleton;