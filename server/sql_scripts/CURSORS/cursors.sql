-- ==============================================================================
-- EXPLICIT CURSORS
-- ==============================================================================

USE aerodrive_db;

DELIMITER //

-- Description: A procedure that uses an explicit cursor to iterate through all active 
-- reservations and flags those where the pickup date has passed but the status is still 'Pending'.
-- It updates their status to 'Cancelled' (No-show).

CREATE PROCEDURE sp_cancel_overdue_reservations()
BEGIN
    DECLARE v_done INT DEFAULT FALSE;
    DECLARE v_ResID INT;
    DECLARE v_VehicleID INT;
    
    -- 1. Declare the explicit cursor
    DECLARE cur_overdue CURSOR FOR 
        SELECT ReservationID, VehicleID
        FROM reservation
        WHERE Status = 'Pending' AND PickupDate < CURDATE();
        
    -- 2. Declare the continue handler for when the cursor reaches the end
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET v_done = TRUE;
    
    -- 3. Open the cursor
    OPEN cur_overdue;
    
    read_loop: LOOP
        -- 4. Fetch the next row
        FETCH cur_overdue INTO v_ResID, v_VehicleID;
        
        -- Check if we are done
        IF v_done THEN
            LEAVE read_loop;
        END IF;
        
        -- Process the fetched record: Update reservation to Cancelled
        UPDATE reservation 
        SET Status = 'Cancelled' 
        WHERE ReservationID = v_ResID;
        
        -- Free up the vehicle
        UPDATE vehicle
        SET Status = 'Available'
        WHERE VehicleID = v_VehicleID;
        
    END LOOP;
    
    -- 5. Close the cursor
    CLOSE cur_overdue;
END;
//

DELIMITER ;
