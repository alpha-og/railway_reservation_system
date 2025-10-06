/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // Add performance indexes for cancellation queries
  pgm.createIndex('bookings', 'status_id', {
    name: 'idx_bookings_status_id',
    ifNotExists: true
  });
  
  pgm.createIndex('booked_seats', 'booking_id', {
    name: 'idx_booked_seats_booking_id', 
    ifNotExists: true
  });
  
  pgm.createIndex('booked_passengers', 'booking_id', {
    name: 'idx_booked_passengers_booking_id',
    ifNotExists: true
  });
  
  pgm.createIndex('payments', ['booking_id', 'status_id'], {
    name: 'idx_payments_booking_status',
    ifNotExists: true
  });
  
  pgm.createIndex('refunds', 'payment_id', {
    name: 'idx_refunds_payment_id',
    ifNotExists: true
  });

  // Add constraint to prevent duplicate refunds for same payment
  pgm.addConstraint('refunds', 'unique_payment_refund', {
    unique: ['payment_id']
  });
  
  // Add constraint to ensure refund amount is positive
  pgm.sql(`
    ALTER TABLE refunds 
    ADD CONSTRAINT check_refund_amount_valid 
    CHECK (amount > '0'::money);
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // Remove constraints
  pgm.dropConstraint('refunds', 'check_refund_amount_valid');
  pgm.dropConstraint('refunds', 'unique_payment_refund');
  
  // Remove indexes
  pgm.dropIndex('refunds', 'idx_refunds_payment_id');
  pgm.dropIndex('payments', 'idx_payments_booking_status');
  pgm.dropIndex('booked_passengers', 'idx_booked_passengers_booking_id');
  pgm.dropIndex('booked_seats', 'idx_booked_seats_booking_id');
  pgm.dropIndex('bookings', 'idx_bookings_status_id');
};
