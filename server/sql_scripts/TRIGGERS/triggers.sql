-- ==============================================================================
-- TRIGGERS
-- ==============================================================================

USE aerodrive_db;

DELIMITER //

-- 1. BEFORE TRIGGER
-- Description: Automatically format the vehicle License Plate to uppercase BEFORE inserting a new vehicle.
CREATE TRIGGER trg_before_vehicle_insert
BEFORE INSERT ON vehicle
FOR EACH ROW
BEGIN
    SET NEW.LicensePlate = UPPER(NEW.LicensePlate);
END;
//

-- 2. AFTER TRIGGER
-- Description: Automatically update the vehicle's status to 'Reserved' AFTER a new confirmed reservation is created.
CREATE TRIGGER trg_after_reservation_insert
AFTER INSERT ON reservation
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Confirmed' THEN
        UPDATE vehicle 
        SET Status = 'Reserved' 
        WHERE VehicleID = NEW.VehicleID;
    END IF;
END;
//

-- 3. AFTER UPDATE TRIGGER
-- Description: Automatically update vehicle status back to 'Available' when a contract is marked as 'Paid' and completed.
CREATE TRIGGER trg_after_contract_update
AFTER UPDATE ON contract
FOR EACH ROW
BEGIN
    IF NEW.PaymentStatus = 'Paid' AND OLD.PaymentStatus != 'Paid' THEN
        UPDATE vehicle 
        SET Status = 'Available' 
        WHERE VehicleID = NEW.VehicleID;
    END IF;
END;
//

DELIMITER ;
