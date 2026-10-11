# 🚗 AeroDrive: Vehicle Rental Management System
 
A full-stack vehicle rental platform built around a **relational database design**: 37 tables, specialization hierarchies, constraints, and a hand-written advanced SQL layer (triggers, stored procedures, cursors, views, transactions, indexing and access control).
 
**🔗 Live demo:** [aerodrive-n1lh.vercel.app](https://aerodrive-n1lh.vercel.app)
 
![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL_8_(schema_%26_SQL)-4479A1?logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?logo=sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/JWT_Auth-000000?logo=jsonwebtokens&logoColor=white)
 
> A database-first project: I built this system to properly learn and apply relational database concepts, from ER modelling and normalization to triggers, transactions and access control.
 
---
 
## ✨ Features
 
- **Four roles:** Manager, Clerk, Mechanic and Customer, each with its own menu and API permissions (JWT + role checks).
- **Reservation wizard:** pick dates, see only vehicles with no overlapping booking, reserve in one transaction.
- **Contract lifecycle:** reservation → contract (pickup mileage recorded) → return (mileage updated, vehicle released).
- **Payments:** one payment table specialised into Cash, Card and Online (JazzCash, Easypaisa, Stripe, PayPal).
- **Fleet management:** cars, bikes and trucks with type-specific attributes; maintenance jobs with parts and costs; damage reports with photo upload; insurance policies with perils and exclusions.
- **Manager dashboard:** KPIs, 6-month revenue chart, fleet-utilisation chart and alerts (overdue contracts, pending damage reports, insurance expiring within 30 days, overdue maintenance).
- **Staff and branch administration** for managers.
 
---
 
## 🗄️ Database design (the core of the project)
 
### Design diagrams
 
The schema is documented with an ER diagram and an extended ER diagram. The full diagrams are very large, so each one is split into parts below. The red boxes on the overview show where each part sits.
 
#### ERD
 
Entities, attributes and relationships. Full diagram: [PNG](docs/ERD.png) / [PDF](docs/ERD.pdf).
 
![ERD overview](docs/erd/00_Overview.png)
 
**Part 1: Branch.** Branch details; one branch employs many staff and holds many vehicles.
 
![ERD part 1: Branch](docs/erd/01_Branch.png)
 
**Part 2: Staff.** Staff with name, address, contact and employment details.
 
![ERD part 2: Staff](docs/erd/02_Staff.png)
 
**Part 3: Vehicle and Model.** Each vehicle belongs to a model and a branch.
 
![ERD part 3: Vehicle and Model](docs/erd/03_Vehicle_and_Model.png)
 
**Part 4: Maintenance and Insurance.** Service records and insurance policies attached to vehicles.
 
![ERD part 4: Maintenance and Insurance](docs/erd/04_Maintenance_and_Insurance.png)
 
**Part 5: Customer.** Customer identity, address, contact and ID details.
 
![ERD part 5: Customer](docs/erd/05_Customer.png)
 
**Part 6: Reservation.** A customer reserves a vehicle for a rental period.
 
![ERD part 6: Reservation](docs/erd/06_Reservation.png)
 
**Part 7: Contract.** A reservation converts into a contract with charges, mileage and payment.
 
![ERD part 7: Contract](docs/erd/07_Contract.png)
 
**Part 8: Damage Report.** Damage found on a vehicle during a contract.
 
![ERD part 8: Damage Report](docs/erd/08_Damage_Report.png)
 
#### EERD
 
Adds the specialization hierarchies and multivalued attributes. Full diagram: [PNG](docs/EERD.png) / [PDF](docs/EERD.pdf).
 
![EERD overview](docs/eerd/00_Overview.png)
 
**Part 1: Person and Emergency Contact.** The Person supertype and its emergency contacts.
 
![EERD part 1: Person and Emergency Contact](docs/eerd/01_Person_and_Emergency_Contact.png)
 
**Part 2: Customer and Staff specialization.** Person specializes into Customer and Staff; Staff specializes into Manager, Clerk and Mechanic.
 
![EERD part 2: Customer and Staff specialization](docs/eerd/02_Customer_and_Staff_Specialization.png)
 
**Part 3: Branch.** Branch and its link to Staff.
 
![EERD part 3: Branch](docs/eerd/03_Branch.png)
 
**Part 4: Vehicle specialization.** Vehicle specializes into Car, Bike and Truck.
 
![EERD part 4: Vehicle specialization](docs/eerd/04_Vehicle_Specialization.png)
 
**Part 5: Model and Insurance.** Vehicle model and insurance policy details.
 
![EERD part 5: Model and Insurance](docs/eerd/05_Model_and_Insurance.png)
 
**Part 6: Reservation.** Reservation and its rental period.
 
![EERD part 6: Reservation](docs/eerd/06_Reservation.png)
 
**Part 7: Contract.** Contract charges, mileage and payment details.
 
![EERD part 7: Contract](docs/eerd/07_Contract.png)
 
**Part 8: Damage Report.** Damage reports linked to contracts and vehicles.
 
![EERD part 8: Damage Report](docs/eerd/08_Damage_Report.png)
 
**Part 9: Maintenance.** Maintenance jobs with cost breakdown and schedule.
 
![EERD part 9: Maintenance](docs/eerd/09_Maintenance.png)
 
**Part 10: Payment specialization.** Payment specializes into Cash, Card and Online.
 
![EERD part 10: Payment specialization](docs/eerd/10_Payment_Specialization.png)
 
### Overview
 
| | |
|---|---|
| Tables | **37** (22 entity tables + 15 multivalued-attribute tables) |
| Foreign keys | **43**, of which 25 use `ON DELETE CASCADE` |
| Constraints | `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE` (CNIC, licence no., registration no., plate), `NOT NULL`, `DEFAULT`, 4 `CHECK`s, 18 `ENUM` columns |
| Engine | MySQL 8 / InnoDB (`server/schema.sql`) |
| Derived data | `v_customer` view computes `Age` from `DateOfBirth` instead of storing it |
 
### Entity relationships
 
```mermaid
erDiagram
    PERSON ||--o| CUSTOMER : "is a"
    PERSON ||--o| STAFF : "is a"
    STAFF ||--o| MANAGER : "is a"
    STAFF ||--o| CLERK : "is a"
    STAFF ||--o| MECHANIC : "is a"
    BRANCH ||--o{ STAFF : employs
    BRANCH ||--o{ VEHICLE : houses
    MODEL ||--o{ VEHICLE : defines
    VEHICLE ||--o| CAR : "is a"
    VEHICLE ||--o| BIKE : "is a"
    VEHICLE ||--o| TRUCK : "is a"
    CUSTOMER ||--o{ RESERVATION : makes
    VEHICLE ||--o{ RESERVATION : "booked in"
    RESERVATION ||--o| CONTRACT : "becomes"
    CONTRACT ||--o{ PAYMENT : "settled by"
    RESERVATION ||--o{ PAYMENT : "paid via"
    PAYMENT ||--o| CASH : "is a"
    PAYMENT ||--o| CARD : "is a"
    PAYMENT ||--o| ONLINE_PAYMENT : "is a"
    VEHICLE ||--o{ DAMAGE_REPORT : has
    CONTRACT ||--o{ DAMAGE_REPORT : "caused during"
    VEHICLE ||--o{ MAINTENANCE : receives
    MECHANIC ||--o{ MAINTENANCE : performs
    VEHICLE ||--o{ INSURANCE : "covered by"
    CUSTOMER ||--o{ EMERGENCY_CONTACT : lists
```
 
### Specialization (ISA) hierarchies
 
Subtype tables share the supertype's primary key (`PK = FK`), so a subtype row cannot exist without its parent.
 
| Supertype | Subtypes |
|---|---|
| `person` | `customer`, `staff` |
| `staff` | `manager`, `clerk`, `mechanic` |
| `vehicle` | `car`, `bike`, `truck` |
| `payment` | `cash`, `card`, `online_payment` |
 
### Normalisation
 
- **1NF:** every multivalued attribute lives in its own table (15 of them): `customer_email`, `staff_skill`, `model_feature`, `insurance_peril`, `damage_photo`, `contract_charge`, `maintenance_part`, and so on.
- **2NF / 3NF:** shared person data is factored into `person` and role data into subtype tables; vehicle model data (brand, rate, seating) lives in `model`, not repeated per vehicle; `age` is derived through a view.
- A few deliberate shortcuts are kept for reporting convenience (for example `contract` also stores `CustomerID` and `VehicleID`).
 
### Advanced SQL (`server/sql_scripts/`)
 
Every concept has its own commented script.
 
| Concept | File | What it demonstrates |
|---|---|---|
| **Triggers** | `TRIGGERS/triggers.sql` | `BEFORE INSERT` upper-cases licence plates; `AFTER INSERT` on `reservation` marks the vehicle *Reserved*; `AFTER UPDATE` on `contract` frees the vehicle when paid |
| **Stored procedures and functions** | `PROCEDURES/procedures.sql` | `sp_calculate_contract_total` (base charge + pending damage costs), `fn_calculate_age` |
| **Transactions (ACID)** | `TRANSACTIONS/transactions.sql` | `sp_process_vehicle_return` with `START TRANSACTION`, `COMMIT` and an `EXIT HANDLER` that `ROLLBACK`s on error |
| **Cursors** | `CURSORS/cursors.sql` | `sp_cancel_overdue_reservations` loops with an explicit cursor and releases the vehicles |
| **Views, GROUP BY, HAVING, aggregates** | `VIEWS/complex_views.sql` | `v_branch_vehicle_stats` (COUNT, conditional SUM, AVG per branch), `v_vehicle_damage_summary` (GROUP BY + HAVING) |
| **Joins** | `JOINS/joins_queries.sql` | INNER, LEFT, RIGHT, and FULL (emulated with `UNION`) |
| **Subqueries** | `SUBQUERIES/subqueries.sql` | Non-correlated, correlated, and scalar subquery in `SELECT` |
| **Set operations** | `SET_OPERATIONS/set_operations.sql` | `UNION`, `INTERSECT`, `EXCEPT` (with pre-8.0.31 emulations) |
| **Indexing** | `INDEXING/indexing.sql` | Indexes on last name, vehicle status, pickup date, branch city |
| **DCL** | `DCL/dcl_commands.sql` | `CREATE USER`, `GRANT`, `REVOKE` for manager and clerk accounts |
| **Packages (simulated)** | `PACKAGES/packages.sql` | MySQL has no packages, so `pkg_reservation_*` procedures and functions share a prefix |
| **Object types (note)** | `OBJECT_TYPES/object_types.sql` | Why Oracle object types map to relational tables or `JSON` columns in MySQL |
 
### Transactions in the application
 
The same business rules run in the API as Sequelize transactions (18 transactional operations), so multi-table changes are all-or-nothing:
 
| Operation | Tables changed together |
|---|---|
| Create reservation | `reservation` + vehicle status |
| Create contract | `contract` + reservation status + vehicle status |
| Close contract | `contract` + vehicle mileage and status + reservation status |
| Record payment | `payment` + `cash` / `card` / `online_payment` |
| Register customer | `person` + `customer` + emails + payment methods + emergency contacts |
| Add vehicle | `vehicle` + `car` / `bike` / `truck` |
| Maintenance job | `maintenance` + vehicle status |
 
### Vehicle status lifecycle
 
```mermaid
stateDiagram-v2
    [*] --> Available
    Available --> Reserved: reservation created
    Reserved --> Available: reservation cancelled
    Reserved --> Rented: contract created
    Rented --> Available: contract closed
    Available --> Maintenance: maintenance job opened
    Maintenance --> Available: job completed
```
 
---
 
## 👥 Roles and access
 
| Module | Manager | Clerk | Mechanic | Customer |
|---|:--:|:--:|:--:|:--:|
| Dashboard | ✅ | | | ✅ |
| Vehicles | ✅ | ✅ | ✅ | ✅ |
| Customers | ✅ | ✅ | | |
| Reservations | ✅ | ✅ | | ✅ (own) |
| Contracts, Payments | ✅ | ✅ | | |
| Damage reports | ✅ | ✅ | | |
| Maintenance | ✅ | | ✅ | |
| Insurance, Branches, Staff | ✅ | | | |
 
Passwords are hashed with bcrypt (cost 12); sessions use signed JWTs; registration input is validated with express-validator.
 
---
 
## 🏗️ Architecture
 
```
React 19 + Vite (Vercel)  ──HTTPS/JSON──►  Express 5 API (Render)  ──Sequelize──►  Database
```
 
- **Frontend:** React 19, Vite, React Router 7, Axios, Recharts, Lucide icons, react-hot-toast (20 page components).
- **Backend:** Node.js, Express 5, Sequelize ORM, JWT, bcryptjs, multer (damage photos). 13 route modules, 53 endpoints.
- **Database:** the schema and advanced SQL are written for **MySQL 8 (InnoDB)**. The currently deployed demo instance is hosted on Render and accessed through Sequelize (PostgreSQL dialect).
 
---
 
## 📂 Project structure
 
```
aerodrive/
├── client/                    # React + Vite frontend
│   └── src/ (pages, components, context, router, api)
├── server/
│   ├── controllers/           # business logic (12 controllers)
│   ├── routes/                # 13 route modules, 53 endpoints
│   ├── models/                # 24 Sequelize models (incl. multivalued attributes)
│   ├── middleware/            # verifyToken, requireRole
│   ├── scripts/seed.js        # creates tables and sample data
│   ├── schema.sql             # full MySQL schema (37 tables)
│   └── sql_scripts/           # triggers, procedures, cursors, views, joins, DCL, ...
├── render.yaml                # Render deployment blueprint
└── SETUP.md
```
 
---
 
## 🚀 Getting started
 
### Prerequisites
- Node.js 18+
- A database: MySQL 8 for the SQL scripts, and PostgreSQL for the Sequelize app as currently configured
 
### 1. Run the MySQL schema and advanced SQL scripts
 
```bash
mysql -u root -p -e "CREATE DATABASE aerodrive_db;"
# schema.sql starts with `USE test;` - change that line to `USE aerodrive_db;` first
mysql -u root -p aerodrive_db < server/schema.sql
 
# then any script you want to try, e.g.:
mysql -u root -p aerodrive_db < server/sql_scripts/TRIGGERS/triggers.sql
mysql -u root -p aerodrive_db < server/sql_scripts/PROCEDURES/procedures.sql
mysql -u root -p aerodrive_db < server/sql_scripts/VIEWS/complex_views.sql
```
 
`INTERSECT` / `EXCEPT` need MySQL 8.0.31+ (emulations are included in the script comments).
 
### 2. Run the web application
 
```bash
# backend
cd server
npm install
cp .env.example .env        # then fill in your own values
npm run seed                # ⚠️ drops and recreates all tables, then loads sample data
npm run dev                 # http://localhost:5000
 
# frontend (new terminal)
cd client
npm install
npm run dev                 # http://localhost:3000
```
 
Environment variables (`server/.env`):
 
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Connection string of **your own** database |
| `DB_SSL` | Set to `false` for a local database without SSL |
| `JWT_SECRET` | Long random string used to sign tokens |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `PORT` | API port (default 5000) |
 
> ⚠️ `npm run seed` uses `sequelize.sync({ force: true })`, which **deletes every table** in the target database. Only run it against a database you can safely reset.
 
### Demo accounts (created by the seed script, local only)
 
| Role | Phone | Password |
|---|---|---|
| Manager | `555-6666` | `password123` |
| Clerk | `555-4444` | `password123` |
| Mechanic | `555-5555` | `password123` |
| Customer | `555-1111` | `password123` |
 
---
 
## 🛣️ Roadmap
 
- Enforce no-overlap bookings inside the database (a `BEFORE INSERT` trigger on `reservation`), not only in the API.
- Run the trigger and procedure scripts on the deployed database so the API can rely on them.
- Full MySQL runtime configuration for the Sequelize app.
- Tests for the reservation → contract → payment flow.
 
---
 
## 📜 License
 
ISC
 
