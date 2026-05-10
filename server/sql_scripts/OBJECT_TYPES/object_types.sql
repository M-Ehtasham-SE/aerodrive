-- ==============================================================================
-- OBJECT TYPES (Compatibility Note)
-- ==============================================================================

-- IMPORTANT COMPATIBILITY NOTE:
-- MySQL is a purely Relational Database Management System (RDBMS) and does NOT 
-- support Object-Relational mapping concepts like Oracle's `CREATE TYPE ... AS OBJECT`.
--
-- In Oracle, one could define an object type like this:
-- 
-- CREATE TYPE address_typ AS OBJECT (
--     Street   VARCHAR2(100),
--     City     VARCHAR2(50),
--     ZipCode  VARCHAR2(20)
-- );
-- /
-- CREATE TABLE branches OF branch_typ;
-- 
-- In MySQL, this structure is achieved natively through relational normalization, 
-- or theoretically by storing data as JSON objects.
--
-- EXAMPLE OF JSON OBJECT USAGE IN MYSQL (as a modern alternative):

USE aerodrive_db;

-- Adding a JSON column to branch for dynamic metadata instead of an Object Type
ALTER TABLE branch 
ADD COLUMN BranchMetaData JSON;

-- Updating a record with a JSON Object
-- UPDATE branch 
-- SET BranchMetaData = '{"manager_name": "Alice", "established_year": 2015}'
-- WHERE BranchID = 1;
