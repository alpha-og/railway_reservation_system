import createApp from "./app.js";
import config from "./utils/config.js";
import { bookingScheduler } from "./services/bookingScheduler.js";

const app = createApp(config);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  
  // Start the booking auto-cancellation scheduler
  bookingScheduler.start();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  bookingScheduler.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  bookingScheduler.stop();
  process.exit(0);
});
