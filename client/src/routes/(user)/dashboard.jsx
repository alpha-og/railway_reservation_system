import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Search,
  Calendar,
  Bookmark,
  User,
  Train,
  Clock,
  ArrowRight,
  MapPin,
  CreditCard,
  Activity,
  Plus,
  Eye,
  TrendingUp,
} from "lucide-react";
import { Card } from "../../components/ui";
import { useProfile } from "../../hooks/useProfile";
import { useUserBookings } from "../../features/user/bookings/hooks/useUserBookings";

export const Route = createFileRoute("/(user)/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { profile, isLoading: profileLoading } = useProfile();
  const { bookings, isLoading: bookingsLoading } = useUserBookings();

  const recentBookings = bookings?.slice(0, 3) || [];
  const totalBookings = bookings?.length || 0;
  const activeBookings = bookings?.filter(booking => 
    booking.status?.toLowerCase() === 'confirmed' || booking.status?.toLowerCase() === 'pending'
  ).length || 0;

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-base-content mb-2">
                Welcome back, {profile?.name || 'User'}!
              </h1>
              <p className="text-base-content/60 text-lg">
                Manage your train bookings and explore new destinations
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/trains"
                className="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="w-5 h-5" />
                Book New Journey
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/60 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-primary">{totalBookings}</p>
              </div>
              <div className="p-3 bg-primary/20 rounded-xl">
                <Bookmark className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/60 mb-1">Active Journeys</p>
                <p className="text-3xl font-bold text-success">{activeBookings}</p>
              </div>
              <div className="p-3 bg-success/20 rounded-xl">
                <Activity className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/60 mb-1">This Month</p>
                <p className="text-3xl font-bold text-warning">
                  {bookings?.filter(booking => {
                    const bookingDate = new Date(booking.departureDate || booking.createdAt);
                    const now = new Date();
                    return bookingDate.getMonth() === now.getMonth() && 
                           bookingDate.getFullYear() === now.getFullYear();
                  }).length || 0}
                </p>
              </div>
              <div className="p-3 bg-warning/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="p-6">
              <h2 className="text-xl font-bold text-base-content mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Quick Actions
              </h2>
              <div className="space-y-4">
                <Link
                  to="/trains"
                  className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all duration-300 group border border-primary/20 hover:border-primary/30"
                >
                  <div className="p-2 bg-primary/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base-content">Search Trains</p>
                    <p className="text-sm text-base-content/60">Find and book tickets</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-base-content/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/bookings"
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/5 hover:bg-secondary/10 transition-all duration-300 group border border-secondary/20 hover:border-secondary/30"
                >
                  <div className="p-2 bg-secondary/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Bookmark className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base-content">My Bookings</p>
                    <p className="text-sm text-base-content/60">View all tickets</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-base-content/40 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/pnr-lookup"
                  className="flex items-center gap-4 p-4 rounded-xl bg-accent/5 hover:bg-accent/10 transition-all duration-300 group border border-accent/20 hover:border-accent/30"
                >
                  <div className="p-2 bg-accent/20 rounded-lg group-hover:scale-110 transition-transform">
                    <Eye className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base-content">PNR Lookup</p>
                    <p className="text-sm text-base-content/60">Check booking status</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-base-content/40 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center gap-4 p-4 rounded-xl bg-info/5 hover:bg-info/10 transition-all duration-300 group border border-info/20 hover:border-info/30"
                >
                  <div className="p-2 bg-info/20 rounded-lg group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5 text-info" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-base-content">Profile Settings</p>
                    <p className="text-sm text-base-content/60">Update your details</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-base-content/40 group-hover:text-info group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Bookings
                </h2>
                <Link to="/bookings" className="btn btn-ghost btn-sm gap-2 hover:bg-primary/10">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {bookingsLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl">
                        <div className="w-12 h-12 bg-base-300 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-base-300 rounded w-3/4"></div>
                          <div className="h-3 bg-base-300 rounded w-1/2"></div>
                        </div>
                        <div className="w-20 h-6 bg-base-300 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking, index) => (
                    <motion.div
                      key={booking.bookingId || booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-4 p-4 bg-base-100 rounded-xl border border-base-content/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Train className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base-content truncate">
                          PNR: {booking.pnr || 'N/A'}
                        </h3>
                        <p className="text-sm text-base-content/60 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {booking.source || 'N/A'} → {booking.destination || 'N/A'}
                        </p>
                        <p className="text-xs text-base-content/50">
                          {booking.departureDate ? new Date(booking.departureDate).toLocaleDateString() : 'No date'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`badge ${
                          booking.status?.toLowerCase() === 'confirmed' 
                            ? 'badge-success' 
                            : booking.status?.toLowerCase() === 'cancelled'
                            ? 'badge-error'
                            : 'badge-warning'
                        }`}>
                          {booking.status || 'Pending'}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-base-200 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Bookmark className="w-8 h-8 text-base-content/40" />
                  </div>
                  <h3 className="text-lg font-semibold text-base-content mb-2">No bookings yet</h3>
                  <p className="text-base-content/60 mb-4">Start your journey by booking your first train ticket</p>
                  <Link to="/trains" className="btn btn-primary gap-2">
                    <Search className="w-4 h-4" />
                    Search Trains
                  </Link>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
