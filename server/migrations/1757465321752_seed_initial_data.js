/* 1757465_seed-data.js */

import { v4 as uuidv4 } from 'uuid';

export const up = async (pgm) => {
  // Roles
  const adminRoleId = uuidv4();
  const customerRoleId = uuidv4();
  pgm.sql(`
    INSERT INTO roles (id, name, created_at, updated_at) VALUES
    ('${adminRoleId}', 'Admin', NOW(), NOW()),
    ('${customerRoleId}', 'Customer', NOW(), NOW());
  `);

  // Users
  const adminUserId = uuidv4();
  const customerUserId = uuidv4();
  pgm.sql(`
    INSERT INTO users (id, name, email, password_hash, role_id, created_at) VALUES
    ('${adminUserId}', 'Admin User', 'admin@example.com', 'admin_password_hash', '${adminRoleId}', NOW()),
    ('${customerUserId}', 'Customer User', 'customer@example.com', 'customer_password_hash', '${customerRoleId}', NOW());
  `);

  // Passengers
  const passengerId = uuidv4();
  pgm.sql(`
    INSERT INTO passengers (id, user_id, name, email, age, created_at) VALUES
    ('${passengerId}', '${customerUserId}', 'John Doe', 'john.doe@example.com', 30, NOW());
  `);

  // Audit Logs
  const auditLogId = uuidv4();
  pgm.sql(`
    INSERT INTO audit_logs (id, user_id, action, timestamp) VALUES
    ('${auditLogId}', '${customerUserId}', 'Created passenger profile', NOW());
  `);

  // Trains
  const train1Id = uuidv4();
  const train2Id = uuidv4();
  pgm.sql(`
    INSERT INTO trains (id, name, code, created_at, updated_at) VALUES
    ('${train1Id}', 'Express Passenger', 'EXP-101', NOW(), NOW()),
    ('${train2Id}', 'Superfast Mail', 'SF-202', NOW(), NOW());
  `);

  // Stations
  const station1Id = uuidv4();
  const station2Id = uuidv4();
  const station3Id = uuidv4();
  pgm.sql(`
    INSERT INTO stations (id, name, code, city, created_at, updated_at) VALUES
    ('${station1Id}', 'New Delhi', 'NDLS', 'Delhi', NOW(), NOW()),
    ('${station2Id}', 'Mumbai Central', 'MMCT', 'Mumbai', NOW(), NOW()),
    ('${station3Id}', 'Bangalore City', 'SBC', 'Bangalore', NOW(), NOW());
  `);

  // Station Distances
  const stationDistanceId = uuidv4();
  pgm.sql(`
    INSERT INTO station_distances (id, from_station_id, to_station_id, distance, created_at, updated_at) VALUES
    ('${stationDistanceId}', '${station1Id}', '${station2Id}', 1386.00, NOW(), NOW());
  `);

  // Schedules
  const scheduleId = uuidv4();
  pgm.sql(`
    INSERT INTO schedules (id, train_id, departure_date, departure_time, created_at, updated_at) VALUES
    ('${scheduleId}', '${train1Id}', '2025-11-20', '08:00:00', NOW(), NOW());
  `);

  // Schedule Stops
  const stop1Id = uuidv4();
  const stop2Id = uuidv4();
  pgm.sql(`
    INSERT INTO schedule_stops (id, schedule_id, station_id, stop_number, arrival_time, departure_time, created_at, updated_at) VALUES
    ('${stop1Id}', '${scheduleId}', '${station1Id}', 1, '08:00:00', '08:05:00', NOW(), NOW()),
    ('${stop2Id}', '${scheduleId}', '${station2Id}', 2, '09:00:00', '09:05:00', NOW(), NOW());
  `);

  // Coach Types
  const acFirstId = uuidv4();
  const sleeperId = uuidv4();
  pgm.sql(`
    INSERT INTO coach_types (id, name, created_at, updated_at) VALUES
    ('${acFirstId}', 'AC First Class', NOW(), NOW()),
    ('${sleeperId}', 'Sleeper', NOW(), NOW());
  `);

  // Coaches
  const coachId = uuidv4();
  pgm.sql(`
    INSERT INTO coaches (id, train_id, coach_type_id, code, created_at, updated_at) VALUES
    ('${coachId}', '${train1Id}', '${acFirstId}', 'A1', NOW(), NOW());
  `);

  // Seat Types
  const lowerBerthId = uuidv4();
  const upperBerthId = uuidv4();
  pgm.sql(`
    INSERT INTO seat_types (id, name, description) VALUES
    ('${lowerBerthId}', 'Lower Berth', 'A seat on the lower level of a sleeper coach.'),
    ('${upperBerthId}', 'Upper Berth', 'A seat on the upper level of a sleeper coach.');
  `);

  // Seats
  const seatId = uuidv4();
  pgm.sql(`
    INSERT INTO seats (id, coach_id, seat_number, seat_type_id, created_at, updated_at) VALUES
    ('${seatId}', '${coachId}', 1, '${lowerBerthId}', NOW(), NOW());
  `);

  // Booking Statuses
  const bookingStatusId = uuidv4();
  pgm.sql(`
    INSERT INTO booking_statuses (id, name, created_at, updated_at) VALUES
    ('${bookingStatusId}', 'Confirmed', NOW(), NOW());
  `);

  // Payment Statuses
  const paymentStatusId = uuidv4();
  pgm.sql(`
    INSERT INTO payment_statuses (id, name, created_at, updated_at) VALUES
    ('${paymentStatusId}', 'Paid', NOW(), NOW());
  `);

  // Refund Statuses
  const refundStatusId = uuidv4();
  pgm.sql(`
    INSERT INTO refund_statuses (id, name, created_at, updated_at) VALUES
    ('${refundStatusId}', 'Pending', NOW(), NOW());
  `);

  // Bookings
  const bookingId = uuidv4();
  pgm.sql(`
    INSERT INTO bookings (id, user_id, schedule_id, from_station_id, to_station_id, booking_date, status_id,pnr,total_amount) VALUES
    ('${bookingId}', '${customerUserId}', '${scheduleId}', '${station1Id}', '${station2Id}', NOW(), '${bookingStatusId}','PNR123456',50.00);
  `);

  // Booked Passengers
  const bookedPassengerId = uuidv4();
  pgm.sql(`
    INSERT INTO booked_passengers (id, booking_id, passenger_id, name, gender, age) VALUES
    ('${bookedPassengerId}', '${bookingId}', '${passengerId}', 'John Doe', 'Male', 30);
  `);

  // Booked Seats
  const bookedSeatId = uuidv4();
  pgm.sql(`
    INSERT INTO booked_seats (id, booking_id, booked_passenger_id, seat_id, created_at, updated_at) VALUES
    ('${bookedSeatId}', '${bookingId}', '${bookedPassengerId}', '${seatId}', NOW(), NOW());
  `);

  // Payments
  const paymentId = uuidv4();
  pgm.sql(`
    INSERT INTO payments (id, booking_id, amount, status_id, payment_date, created_at, updated_at) VALUES
    ('${paymentId}', '${bookingId}', 50.00, '${paymentStatusId}', NOW(), NOW(), NOW());
  `);

  // Refunds
  const refundId = uuidv4();
  pgm.sql(`
    INSERT INTO refunds (id, payment_id, amount, status_id, refund_date, created_at, updated_at) VALUES
    ('${refundId}', '${paymentId}', 50.00, '${refundStatusId}', NOW(), NOW(), NOW());
  `);
};

export const down = async (pgm) => {
  pgm.sql(`
    DELETE FROM refunds;
    DELETE FROM payments;
    DELETE FROM booked_seats;
    DELETE FROM booked_passengers;
    DELETE FROM bookings;
    DELETE FROM refund_statuses;
    DELETE FROM payment_statuses;
    DELETE FROM booking_statuses;
    DELETE FROM seats;
    DELETE FROM seat_types;
    DELETE FROM coaches;
    DELETE FROM coach_types;
    DELETE FROM schedule_stops;
    DELETE FROM schedules;
    DELETE FROM station_distances;
    DELETE FROM stations;
    DELETE FROM trains;
    DELETE FROM audit_logs;
    DELETE FROM passengers;
    DELETE FROM users;
    DELETE FROM roles;
  `);
};
