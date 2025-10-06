import cron from 'node-cron';
import { queryDB } from '../utils/db.js';

class BookingScheduler {
  constructor() {
    this.isRunning = false;
  }

  /**
   * Start the auto-cancellation scheduler
   * Runs every 2 minutes to check for expired bookings
   */
  start() {
    if (this.isRunning) {
      console.log('📅 Booking scheduler is already running');
      return;
    }

    // Run every 2 minutes: '*/2 * * * *'
    this.cronJob = cron.schedule('*/2 * * * *', async () => {
      await this.autoCancelExpiredBookings();
    }, {
      scheduled: false
    });

    this.cronJob.start();
    this.isRunning = true;
    console.log('📅 Booking auto-cancellation scheduler started (runs every 2 minutes)');
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.isRunning = false;
      console.log('📅 Booking scheduler stopped');
    }
  }

  /**
   * Execute the auto-cancellation function
   */
  async autoCancelExpiredBookings() {
    try {
      console.log('🔍 Checking for expired bookings...');
      
      const result = await queryDB('SELECT auto_cancel_expired_bookings() as cancelled_count');
      const cancelledCount = result.rows[0]?.cancelled_count || 0;
      
      if (cancelledCount > 0) {
        console.log(`⚠️  Auto-cancelled ${cancelledCount} expired booking(s)`);
      } else {
        console.log('✅ No expired bookings found');
      }
      
      return cancelledCount;
    } catch (error) {
      console.error('❌ Error in auto-cancel expired bookings:', error.message);
      throw error;
    }
  }

  /**
   * Manual trigger for testing
   */
  async triggerNow() {
    console.log('🚀 Manually triggering auto-cancellation...');
    return await this.autoCancelExpiredBookings();
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      nextRun: this.isRunning && this.cronJob ? 'Every 2 minutes' : 'Not scheduled'
    };
  }
}

// Export singleton instance
export const bookingScheduler = new BookingScheduler();
export default bookingScheduler;