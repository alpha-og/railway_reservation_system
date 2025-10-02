import { LoadingSkeleton } from "../../../../../components/LoadingSkeleton";
import { GalleryContainer } from "../GalleryContainer";

export const LoadingState = () => (
  <GalleryContainer>
    <div className="mb-4">
      <LoadingSkeleton className="h-6 w-32" />
    </div>
    <div className="relative w-full h-full">
      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-4 overflow-y-scroll p-1">
        {[...Array(8)].map((_, i) => (
          <LoadingSkeleton key={i} type="train-card" />
        ))}
      </div>
    </div>
  </GalleryContainer>
);