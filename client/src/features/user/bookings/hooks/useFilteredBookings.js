import { useMemo } from "react";

export function useFilteredBookings(
  bookings = [], // default empty array
  statusFilter = "all",
  dateFilter,
  searchTerm
) {
  return useMemo(() => {
    // Ensure bookings is an array
    const bookingsArray = Array.isArray(bookings) ? bookings : [];
    
    return bookingsArray.filter((b) => {
      if (!b) return false;

      const status = b.status?.toLowerCase() || "";
      const departureDate = b.departureDate || "";
      const pnr = b.pnr || "";
      const source = b.source || "";
      const destination = b.destination || "";

      let matches = true;

      if (statusFilter !== "all" && status !== statusFilter.toLowerCase())
        matches = false;

      if (dateFilter && departureDate !== dateFilter) matches = false;

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const combined = `${pnr} ${source} ${destination}`.toLowerCase();
        if (!combined.includes(term)) matches = false;
      }

      return matches;
    });
  }, [bookings, statusFilter, dateFilter, searchTerm]);
}
