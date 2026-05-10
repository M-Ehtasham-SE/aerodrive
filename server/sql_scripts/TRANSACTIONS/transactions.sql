-- ==============================================================================
-- TRANSACTIONS / ACID DEMONSTRATION
-- ==============================================================================

USE aerodrive_db;

DELIMITER //

-- Description: Demonstrates ACID properties (Atomicity, Consistency, Isolation, Durability)
-- by using COMMIT and ROLLBACK explicitly inside a stored procedure.
-- Scenario: Processing a vehicle return, marking contract paid, updating mileage, and setting vehicle available.

CREATE PROCEDURE sp_process_vehicle_return(
    IN p_ContractNo VARCHAR(30),
    IN p_FinalMileage INT
)
BEGIN
    DECLARE v_VehicleID INT;
    DECLARE exit handler for sqlexception
    BEGIN
        -- Error occurred, rollback the transaction
        ROLLBACK;
        SELECT 'Transaction Failed, rolled back.' AS Status;
    END;

    -- Start the Transaction
    START TRANSACTION;

    -- 1. Get the Vehicle ID associated with the contract
    SELECT VehicleID INTO v_VehicleID 
    FROM contract 
    WHERE ContractNo = p_ContractNo;

    -- 2. Update the contract end details (Atomicity begins)
    UPDATE contract 
    SET PaymentStatus = 'Paid', MileageAtEnd = p_FinalMileage
    WHERE ContractNo = p_ContractNo;

    -- 3. Update the vehicle's total mileage and status
    UPDATE vehicle 
    SET Mileage = Mileage + (p_FinalMileage - (SELECT MileageAtStart FROM contract WHERE ContractNo = p_ContractNo)),
        Status = 'Available'
    WHERE VehicleID = v_VehicleID;

    -- If we reach here without errors, Commit the transaction permanently
    COMMIT;
    SELECT 'Transaction Completed Successfully.' AS Status;
    
END;
//

DELIMITER ;
