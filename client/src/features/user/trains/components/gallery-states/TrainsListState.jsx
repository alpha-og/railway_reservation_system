import { TrainCard } from "../TrainCard";
import { GalleryContainer } from "../GalleryContainer";

export const TrainsListState = ({ trains, searchParams }) => (
  <GalleryContainer className="overflow-hidden md:w-11/12">
    <div className="mb-4">
      <h3 className="text-lg font-semibold">
        {trains.length} train{trains.length !== 1 ? 's' : ''} found
      </h3>
    </div>
    <div className="relative w-full h-full">
      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-4 overflow-y-scroll p-1">
        {trains.map((train) => (
          <TrainCard key={train.id} train={train} searchParams={searchParams} />
        ))}
      </div>
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-base-100 to-transparent z-10" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-base-100 to-transparent z-10" />
    </div>
  </GalleryContainer>
);