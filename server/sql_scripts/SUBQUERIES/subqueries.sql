-- ==============================================================================
-- SUBQUERIES
-- ==============================================================================

USE aerodrive_db;

-- 1. NON-CORRELATED SUBQUERY
-- Description: Find all vehicles that have a daily rate higher than the overall average daily rate of all models.
SELECT RegistrationNo, Status, ModelID
FROM vehicle
WHERE ModelID IN (
    SELECT ModelID 
    FROM model 
    WHERE DailyRate > (SELECT AVG(DailyRate) FROM model)
);

-- 2. CORRELATED SUBQUERY
-- Description: Find the latest reservation made by each customer.
-- The inner query references the CustomerID from the outer query.
SELECT r1.ReservationID, r1.CustomerID, r1.ReservationDate
FROM reservation r1
WHERE r1.ReservationDate = (
    SELECT MAX(r2.ReservationDate)
    FROM reservation r2
    WHERE r2.CustomerID = r1.CustomerID
);

-- 3. SUBQUERY IN THE SELECT CLAUSE
-- Description: Show each branch along with the total number of vehicles currently assigned to it.
SELECT b.BranchName, b.City,
    (SELECT COUNT(*) 
     FROM vehicle v 
     WHERE v.BranchID = b.BranchID) AS TotalVehicles
FROM branch b;
