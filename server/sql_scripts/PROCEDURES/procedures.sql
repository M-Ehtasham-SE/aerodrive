-- ==============================================================================
-- PROCEDURES & FUNCTIONS
-- ==============================================================================

USE aerodrive_db;

DELIMITER //

-- 1. STORED PROCEDURE
-- Description: Calculates the total cost for a contract based on base charge and damage costs (if any).
CREATE PROCEDURE sp_calculate_contract_total(IN p_ContractNo VARCHAR(30), OUT p_TotalCost DECIMAL(10,2))
BEGIN
    DECLARE v_BaseCharge DECIMAL(10,2);
    DECLARE v_DamageCost DECIMAL(10,2) DEFAULT 0.00;

    -- Get Base Charge from contract
    SELECT BaseCharge INTO v_BaseCharge
    FROM contract
    WHERE ContractNo = p_ContractNo;

    -- Get sum of repair costs from any associated damage reports
    SELECT COALESCE(SUM(RepairCost), 0) INTO v_DamageCost
    FROM damage_report
    WHERE ContractNo = p_ContractNo AND Status = 'Pending';

    -- Set total
    SET p_TotalCost = v_BaseCharge + v_DamageCost;

    -- Update the contract total charge
    UPDATE contract
    SET TotalCharge = p_TotalCost
    WHERE ContractNo = p_ContractNo;
END;
//

-- 2. STORED FUNCTION
-- Description: A function that calculates the age of a customer based on their DateOfBirth.
CREATE FUNCTION fn_calculate_age(p_DOB DATE) 
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE v_Age INT;
    SET v_Age = TIMESTAMPDIFF(YEAR, p_DOB, CURDATE());
    RETURN v_Age;
END;
//

DELIMITER ;
