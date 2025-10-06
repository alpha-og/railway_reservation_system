import { Link, createFileRoute } from '@tanstack/react-router';
import { Train } from 'lucide-react';
import {BookingList} from '../../../features/user/bookings/components';

// The key change: export a 'Route' piece
export const Route = createFileRoute('/(user)/bookings/')({
  component: UserBookingsPage,
});

function UserBookingsPage() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">
              My Bookings
            </h1>
            <p className="text-sm sm:text-base text-base-content/70">
              View and manage all your train reservations
            </p>
          </div>
          <Link to="/trains" className="btn btn-primary">
            <Train className="h-5 w-5 mr-2" />
            Book New Ticket
          </Link>
        </div>
        
        {/* Booking List */}
        <BookingList/>
      </div>
    </div>
  );
}
