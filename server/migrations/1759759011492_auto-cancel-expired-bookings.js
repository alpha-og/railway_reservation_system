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
  // Create function to auto-cancel expired bookings
  pgm.createFunction(
    'auto_cancel_expired_bookings',
    [],
    {
      returns: 'integer',
      language: 'plpgsql',
      replace: true,
    },
    `
    DECLARE
        pending_status_id UUID;
        cancelled_status_id UUID;
        expired_bookings_count INTEGER := 0;
        booking_record RECORD;
    BEGIN
        SELECT id INTO pending_status_id FROM booking_statuses WHERE name = 'Pending';
        SELECT id INTO cancelled_status_id FROM booking_statuses WHERE name = 'Cancelled';
        
        FOR booking_record IN
            SELECT b.id, b.booking_date, b.pnr, b.user_id
            FROM bookings b
            WHERE b.status_id = pending_status_id
            AND b.booking_date < NOW() - INTERVAL '10 minutes'
            AND NOT EXISTS (
                SELECT 1 FROM payments p 
                WHERE p.booking_id = b.id 
                AND p.status_id = (SELECT id FROM payment_statuses WHERE name = 'Completed')
            )
            ORDER BY b.booking_date
            LIMIT 100
        LOOP
            UPDATE bookings 
            SET status_id = cancelled_status_id
            WHERE id = booking_record.id;
            
            -- Log auto-cancellation in audit_logs
            INSERT INTO audit_logs (
                id,
                user_id,
                action,
                timestamp
            ) VALUES (
                gen_random_uuid(),
                booking_record.user_id,
                'AUTO_CANCEL_EXPIRED: PNR ' || booking_record.pnr || ' - Booking expired after 10 minutes without payment',
                NOW()
            );
            
            expired_bookings_count := expired_bookings_count + 1;
        END LOOP;
        
        RETURN expired_bookings_count;
    END;
    `
  );

  // Update the existing booking cancellation trigger function to use correct audit_logs structure
  pgm.createFunction(
    'handle_booking_cancellation',
    [],
    {
      returns: 'trigger',
      language: 'plpgsql',
      replace: true,
    },
    `
    DECLARE
        cancelled_status_id UUID;
        refund_requested_status_id UUID;
        booking_total DECIMAL(10,2);
        existing_payment_id UUID;
    BEGIN
        -- Only proceed if booking status is being changed to 'Cancelled'
        IF NEW.status_id != OLD.status_id THEN
            -- Get the 'Cancelled' status ID
            SELECT id INTO cancelled_status_id
            FROM booking_statuses
            WHERE name = 'Cancelled';
            
            -- If the new status is 'Cancelled'
            IF NEW.status_id = cancelled_status_id THEN
                -- 1. Delete booked seats (will free up the seats)
                DELETE FROM booked_seats WHERE booking_id = NEW.id;
                
                -- 2. Delete booked passengers (cascade cleanup)
                DELETE FROM booked_passengers WHERE booking_id = NEW.id;
                
                -- 3. Handle refund creation for existing payments
                -- Get existing payment for this booking (if any)
                SELECT id, amount INTO existing_payment_id, booking_total
                FROM payments
                WHERE booking_id = NEW.id
                AND status_id = (
                    SELECT id FROM payment_statuses WHERE name = 'Completed'
                )
                LIMIT 1;
                
                -- If there's a completed payment, create a refund request
                IF existing_payment_id IS NOT NULL THEN
                    -- Get 'Requested' refund status ID
                    SELECT id INTO refund_requested_status_id
                    FROM refund_statuses
                    WHERE name = 'Requested';
                    
                    -- Create refund record
                    INSERT INTO refunds (
                        id,
                        payment_id,
                        amount,
                        status_id,
                        created_at,
                        updated_at
                    ) VALUES (
                        gen_random_uuid(),
                        existing_payment_id,
                        booking_total,
                        refund_requested_status_id,
                        NOW(),
                        NOW()
                    );
                END IF;
                
                -- Log the cancellation using correct audit_logs structure
                INSERT INTO audit_logs (
                    id,
                    user_id,
                    action,
                    timestamp
                ) VALUES (
                    gen_random_uuid(),
                    NEW.user_id,
                    'BOOKING_CANCELLED: PNR ' || NEW.pnr || ' - Status changed from Pending to Cancelled',
                    NOW()
                );
            END IF;
        END IF;
        
        RETURN NEW;
    END;
    `
  );

  // Ensure the trigger exists (replace if it already exists)
  pgm.sql(`
    DROP TRIGGER IF EXISTS booking_cancellation_trigger ON bookings;
    CREATE TRIGGER booking_cancellation_trigger
        AFTER UPDATE ON bookings
        FOR EACH ROW
        EXECUTE FUNCTION handle_booking_cancellation();
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // Remove the trigger
  pgm.sql('DROP TRIGGER IF EXISTS booking_cancellation_trigger ON bookings');
  
  // Drop the functions
  pgm.dropFunction('auto_cancel_expired_bookings', []);
  pgm.dropFunction('handle_booking_cancellation', []);
};
