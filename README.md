# AeroDrive — Vehicle Rental Management System

> *Fleet Intelligence. Redefined.*  
> Student: Muhammad Ehtasham | ID: 24F-3098  
> Stack: React · Node.js · Express · MySQL 8 · Sequelize

---

## Project Overview

AeroDrive is a full-stack, role-based Vehicle Rental Management System built to digitise every operational workflow — from customer onboarding and reservation creation, to contract generation, payment processing, maintenance scheduling, damage reporting, and executive analytics — across multiple branches.

**GitHub:** https://github.com/M-Ehtasham-SE/aerodrive

---

## Features

- **Role-based access control** — Manager, Clerk, Mechanic, Customer
- **Vehicle Management** — Car / Bike / Truck with subclass attributes
- **Customer Registry** — Full profiles with multivalued attributes
- **Reservation System** — Availability checking, no double-booking
- **Contract Management** — Auto-generated from reservations
- **Payment Gateway** — Cash / Card / Online (JazzCash, Easypaisa, PayPal)
- **Damage Reports** — Photo upload, severity tracking
- **Maintenance Tracker** — Mechanic portal, parts tracking
- **Insurance Manager** — Policy with perils and exclusions
- **Branch Management** — Multi-branch with staff assignment
- **Manager Dashboard** — Live KPIs, revenue charts, fleet utilisation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, React Router, Recharts, Lucide Icons |
| Backend | Node.js + Express.js |
| ORM | Sequelize |
| Database | MySQL 8 (InnoDB, utf8mb4) |
| Auth | JWT + bcrypt |
| File Upload | Multer |

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- MySQL 8 running locally
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/M-Ehtasham-SE/aerodrive.git
cd aerodrive
```

### 2. Create the MySQL Database

Open MySQL and run:

```sql
CREATE DATABASE aerodrive_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Then import the schema:

```bash
mysql -u root -p aerodrive_db < server/schema.sql
```

### 3. Configure Environment

Edit `server/.env` with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=yourpassword
DB_NAME=aerodrive_db
JWT_SECRET=aerodrive_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
UPLOAD_PATH=./uploads
```

### 4. Install & Run the Server

```bash
cd server
npm install
npm run dev
```

Server starts on **http://localhost:5000**

### 5. Seed the Database

Once the server is running and DB is connected:

```bash
npm run seed
```

This seeds: 2 branches, 3 models, 5 vehicles, 3 customers, 2 staff, 1 manager.

**Manager login credentials:**
- Phone: `555-6666`
- Password: `password123`

### 6. Install & Run the Client

```bash
cd client
npm install
npm run dev
```

Client starts on **http://localhost:3000**

---

## Default Login Accounts (after seeding)

| Role | Phone | Password |
|---|---|---|
| Manager | 555-6666 | password123 |
| Staff (Clerk) | 555-4444 | password123 |
| Customer | 555-1111 | password123 |

---

## Project Structure

```
aerodrive/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── api/         # Axios instance + API modules
│       ├── components/  # Layout + common components
│       ├── context/     # AuthContext
│       ├── pages/       # All page components
│       └── router/      # AppRouter + ProtectedRoute
└── server/          # Node.js + Express backend
    ├── config/      # DB connection
    ├── controllers/ # Business logic
    ├── middleware/  # JWT auth + role guards + multer
    ├── models/      # Sequelize models + associations
    ├── routes/      # Express route definitions
    └── scripts/     # DB seed script
```

---

## Database

- **36 tables** (22 entity + 14 multivalued attribute tables)
- **4 inheritance hierarchies**: Person, Vehicle, Payment, Staff
- **Shared Primary Key** strategy for subclass tables
- **Derived attribute**: Age computed via `TIMESTAMPDIFF` in `v_customer` view
- **18 FK relationships** enforced at DB level

---

*AeroDrive — Built from EERD to production.*
