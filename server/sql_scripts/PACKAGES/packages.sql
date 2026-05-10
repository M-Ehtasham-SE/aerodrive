-- ==============================================================================
-- PACKAGES (Simulated / Compatibility Note)
-- ==============================================================================

-- IMPORTANT COMPATIBILITY NOTE:
-- MySQL does NOT natively support PL/SQL "Packages" (like Oracle does with 
-- CREATE PACKAGE and CREATE PACKAGE BODY).
-- 
-- In MySQL, package functionality is simulated by creating standalone procedures 
-- and functions that share a common naming prefix (e.g., `pkg_reservation_`).

USE aerodrive_db;

DELIMITER //

-- Simulated Package Function 1: Validate Reservation Dates
CREATE FUNCTION pkg_reservation_validate_dates(p_Pickup DATE, p_Return DATE) 
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    IF p_Pickup < CURDATE() OR p_Return < p_Pickup THEN
        RETURN FALSE;
    ELSE
        RETURN TRUE;
    END IF;
END;
//

-- Simulated Package Procedure 1: Create Quick Reservation
CREATE PROCEDURE pkg_reservation_create(
    IN p_CustomerID INT, 
    IN p_VehicleID INT, 
    IN p_Pickup DATE, 
    IN p_Return DATE
)
BEGIN
    DECLARE v_isValid BOOLEAN;
    
    -- Calling the "package" function
    SET v_isValid = pkg_reservation_validate_dates(p_Pickup, p_Return);
    
    IF v_isValid THEN
        INSERT INTO reservation (PickupDate, ReturnDate, CustomerID, VehicleID, Status)
        VALUES (p_Pickup, p_Return, p_CustomerID, p_VehicleID, 'Confirmed');
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid reservation dates provided.';
    END IF;
END;
//

DELIMITER ;
