/*import React from 'react';
import StationsList from './components/StationsList';

const StationsIndex = () => {
  return <StationsList />;
};

export default StationsIndex;*/

import { createFileRoute } from '@tanstack/react-router';
import StationsList from '../../../features/admin/stations/components/StationsList';

export const Route = createFileRoute('/admin/stations/')({
  component: StationsComponent,
});

function StationsComponent() {
  return <StationsList />;
}