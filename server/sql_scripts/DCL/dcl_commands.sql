-- ==============================================================================
-- DCL COMMANDS
-- Description: Demonstrates GRANT, REVOKE, and Role/User creation.
-- ==============================================================================

-- 1. Create Example Roles/Users
CREATE USER IF NOT EXISTS 'aero_manager'@'localhost' IDENTIFIED BY 'manager_pass_123';
CREATE USER IF NOT EXISTS 'aero_clerk'@'localhost' IDENTIFIED BY 'clerk_pass_123';

-- 2. GRANT Privileges
GRANT ALL PRIVILEGES ON aerodrive_db.* TO 'aero_manager'@'localhost';

GRANT SELECT, INSERT, UPDATE ON aerodrive_db.reservation TO 'aero_clerk'@'localhost';
GRANT SELECT, INSERT, UPDATE ON aerodrive_db.payment TO 'aero_clerk'@'localhost';
GRANT SELECT, INSERT, UPDATE ON aerodrive_db.customer TO 'aero_clerk'@'localhost';
GRANT SELECT ON aerodrive_db.vehicle TO 'aero_clerk'@'localhost';

FLUSH PRIVILEGES;

-- 3. REVOKE Privileges
REVOKE UPDATE ON aerodrive_db.customer FROM 'aero_clerk'@'localhost';
FLUSH PRIVILEGES;
