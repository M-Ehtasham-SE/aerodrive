# AeroDrive Database Requirements Verification Scripts

This folder contains SQL scripts explicitly designed to fulfill the advanced database concepts required for the Phase II, III, and IV evaluations of the AeroDrive database project. 

While the application utilizes an ORM (Sequelize) to manage much of this logic automatically, these files demonstrate proficiency in writing raw SQL constructs for the underlying Relational Database Management System.

## Structure

* `/DCL/` - Demonstrates GRANT, REVOKE, and User creation.
* `/INDEXING/` - Creation of explicit indexes on frequently searched columns.
* `/JOINS/` - Examples of INNER, LEFT, RIGHT, and FULL joins (with MySQL emulations).
* `/SET_OPERATIONS/` - Demonstrates UNION, INTERSECT, and MINUS/EXCEPT (with MySQL compatibility notes).
* `/SUBQUERIES/` - Contains correlated and non-correlated subqueries.
* `/TRIGGERS/` - Implements BEFORE and AFTER triggers.
* `/PROCEDURES/` - Contains stored procedures and functions handling business logic.
* `/CURSORS/` - Demonstrates explicit cursor loops for iterating data.
* `/VIEWS/` - Contains complex views utilizing JOINS, GROUP BY, and aggregates.
* `/TRANSACTIONS/` - Explicit ACID transaction examples utilizing COMMIT and ROLLBACK.
* `/PACKAGES/` - Emulates PL/SQL packages using prefixed procedure names (as MySQL lacks native package support).
* `/OBJECT_TYPES/` - Compatibility notes regarding Object-Relational Types in MySQL.

## DBMS Compatibility Notes

The application utilizes **MySQL/InnoDB**. The following are standard DBMS limitations in MySQL regarding Oracle PL/SQL specific requirements:

1. **MINUS & INTERSECT:** Supported natively only in MySQL 8.0.31+. Emulations using `NOT IN` or `INNER JOIN` are documented.
2. **FULL OUTER JOIN:** Not supported in MySQL natively. Emulated using a `UNION` of a `LEFT JOIN` and a `RIGHT JOIN`.
3. **PACKAGES:** MySQL does not have `CREATE PACKAGE` constructs. This is logically simulated by creating grouped stored procedures with identical prefixes (e.g., `pkg_name_function()`).
4. **OBJECT TYPES:** MySQL is strictly a relational database and does not support Oracle's `CREATE TYPE ... AS OBJECT`. Relationships are managed purely relationally or via standard `JSON` data types. 

These SQL files serve as the academic proof of database concept comprehension and are heavily commented to facilitate the Viva evaluation.
