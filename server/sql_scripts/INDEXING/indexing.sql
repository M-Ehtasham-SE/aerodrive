-- ==============================================================================
-- INDEXING
-- ==============================================================================

USE aerodrive_db;

-- Description: Create explicit indexes to optimize performance on frequently searched columns.
-- These columns are often used in WHERE clauses, JOIN conditions, or ORDER BY statements.

-- Index for searching people by their last name (common in admin dashboards)
CREATE INDEX idx_person_lastname ON person(LastName);

-- Index for filtering vehicles by their status (e.g., finding 'Available' vehicles quickly)
CREATE INDEX idx_vehicle_status ON vehicle(Status);

-- Index for filtering reservations by date (common for generating daily reports)
CREATE INDEX idx_reservation_date ON reservation(PickupDate);

-- Index for searching branches by city
CREATE INDEX idx_branch_city ON branch(City);
