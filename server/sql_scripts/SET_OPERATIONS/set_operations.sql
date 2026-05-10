-- ==============================================================================
-- SET OPERATIONS
-- ==============================================================================

USE aerodrive_db;

-- 1. UNION OPERATION
-- Description: Get a combined list of all emails associated with both customers and staff.
SELECT Email, 'Customer' as Role FROM customer_email
UNION
SELECT Email, 'Staff' as Role FROM staff_email;

-- 2. INTERSECT OPERATION
-- Description: Find cities where we have both a Branch AND Customers living there.
-- Note: MySQL <= 8.0.30 does not support INTERSECT keyword, but it can be emulated via INNER JOIN or IN. 
-- Assuming standard SQL or MySQL >= 8.0.31:
SELECT City FROM branch
INTERSECT
SELECT City FROM person;

-- Example of MySQL < 8.0.31 emulation for INTERSECT:
-- SELECT DISTINCT b.City FROM branch b INNER JOIN person p ON b.City = p.City;

-- 3. MINUS / EXCEPT OPERATION
-- Description: Find customers who have registered an account but NEVER made a reservation.
-- Note: MySQL uses EXCEPT (Oracle uses MINUS).
SELECT PersonID FROM customer
EXCEPT
SELECT CustomerID FROM reservation;

-- Example of MySQL < 8.0.31 emulation for EXCEPT:
-- SELECT PersonID FROM customer WHERE PersonID NOT IN (SELECT CustomerID FROM reservation);
