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
  // Create trigger function for booking cancellation cascade
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
                
                -- Log the cancellation (optional audit trail)
                INSERT INTO audit_logs (
                    id,
                    table_name,
                    operation,
                    record_id,
                    old_values,
                    new_values,
                    created_at
                ) VALUES (
                    gen_random_uuid(),
                    'bookings',
                    'CANCEL',
                    NEW.id,
                    json_build_object('status_id', OLD.status_id),
                    json_build_object('status_id', NEW.status_id),
                    NOW()
                );
            END IF;
        END IF;
        
        RETURN NEW;
    END;
    `
  );

  // Create the trigger
  pgm.createTrigger(
    'bookings',
    'booking_cancellation_trigger',
    {
      when: 'AFTER',
      operation: 'UPDATE',
      function: 'handle_booking_cancellation',
      level: 'ROW'
    }
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // Drop the trigger first
  pgm.dropTrigger('bookings', 'booking_cancellation_trigger');
  
  // Drop the trigger function
  pgm.dropFunction('handle_booking_cancellation', []);
};
