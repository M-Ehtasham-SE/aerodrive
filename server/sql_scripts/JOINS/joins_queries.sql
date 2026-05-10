-- ==============================================================================
-- ADVANCED JOIN QUERIES
-- ==============================================================================

USE aerodrive_db;

-- 1. INNER JOIN QUERY
-- Description: Get all reservations with their corresponding customer names and vehicle registration numbers.
SELECT r.ReservationID, c.FirstName, c.LastName, v.RegistrationNo, r.PickupDate 
FROM reservation r
INNER JOIN v_customer c ON r.CustomerID = c.PersonID
INNER JOIN vehicle v ON r.VehicleID = v.VehicleID;

-- 2. LEFT JOIN QUERY
-- Description: List all branches and any staff assigned to them (including branches with NO staff).
SELECT b.BranchName, s.Position, p.FirstName
FROM branch b
LEFT JOIN staff s ON b.BranchID = s.BranchID
LEFT JOIN person p ON s.PersonID = p.PersonID;

-- 3. RIGHT JOIN QUERY
-- Description: List all vehicles and their associated maintenance records (including vehicles that have NEVER been maintained).
SELECT m.MaintenanceID, m.ServiceType, v.RegistrationNo
FROM maintenance m
RIGHT JOIN vehicle v ON m.VehicleID = v.VehicleID;

-- 4. FULL JOIN QUERY (Emulated in MySQL using UNION of LEFT and RIGHT JOIN)
-- Description: Find all customers and all reservations, showing customers without reservations and reservations without known customers.
SELECT c.PersonID, c.FirstName, r.ReservationID, r.Status
FROM v_customer c
LEFT JOIN reservation r ON c.PersonID = r.CustomerID
UNION
SELECT c.PersonID, c.FirstName, r.ReservationID, r.Status
FROM v_customer c
RIGHT JOIN reservation r ON c.PersonID = r.CustomerID;
