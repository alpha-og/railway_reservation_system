import { useEffect } from "react";
import { useTrains } from "../hooks/useTrains";
import { useSearch } from "@tanstack/react-router";
import { determineGalleryState } from "../utils/galleryStateUtils";
import { LoadingState } from "./gallery-states/LoadingState";
import { ErrorState } from "./gallery-states/ErrorState";
import { EmptyState } from "./gallery-states/EmptyState";
import { InitialState } from "./gallery-states/InitialState";
import { TrainsListState } from "./gallery-states/TrainsListState";

const GALLERY_COMPONENTS = {
  loading: LoadingState,
  error: ErrorState,
  empty: EmptyState,
  initial: InitialState,
  trainsList: TrainsListState,
};

export default function TrainsGallery() {
  const search = useSearch({ from: "/(user)/trains/" });
  const { trains, isLoading, error, isSuccess, setSearchFilters } = useTrains({
    from: search.from,
    to: search.to,
    date: search.date,
    class: search.class,
  });

  useEffect(() => {
    setSearchFilters(search);
  }, [setSearchFilters, search]);

  const currentState = determineGalleryState({ isLoading, error, isSuccess, trains, search });
  const StateComponent = GALLERY_COMPONENTS[currentState];

  const stateProps = {
    error,
    trains,
    searchParams: search,
  };

  return <StateComponent {...stateProps} />;
}
