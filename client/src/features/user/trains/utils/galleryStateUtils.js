export const determineGalleryState = ({ isLoading, error, isSuccess, trains, search }) => {
  if (isLoading) return 'loading';
  if (error) return 'error';
  
  const hasSearchParams = search.from && search.to && search.date;
  const hasTrains = trains.length > 0;
  
  if (isSuccess && !hasTrains && hasSearchParams) return 'empty';
  if (hasTrains) return 'trainsList';
  
  return 'initial';
};