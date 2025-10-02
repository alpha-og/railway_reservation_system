import { GalleryContainer } from "../GalleryContainer";

export const EmptyState = () => (
  <GalleryContainer>
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">🚂</div>
      <h3 className="text-lg font-semibold mb-2">No trains found</h3>
      <p className="text-base-content/60 mb-4">
        No trains available for the selected route and date.
      </p>
      <p className="text-sm text-base-content/40">
        Try searching for a different date or route.
      </p>
    </div>
  </GalleryContainer>
);