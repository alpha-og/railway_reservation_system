import { GalleryContainer } from "../GalleryContainer";

export const InitialState = () => (
  <GalleryContainer>
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold mb-2">Search for trains</h3>
      <p className="text-base-content/60">
        Enter your travel details to find available trains.
      </p>
    </div>
  </GalleryContainer>
);