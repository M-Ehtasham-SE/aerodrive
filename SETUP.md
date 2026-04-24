# RideNext: Vehicle Rental Management System
## Setup and Installation Guide

Follow these steps to set up the project on a new machine.

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MySQL Server**

### 2. Environment Configuration
Create a `.env` file in the `/server` directory with the following variables:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=aerodrive_db
JWT_SECRET=your_super_secret_key_123
```

### 3. Installation
Open your terminal and run the following commands:

**For the Backend:**
```bash
cd server
npm install
```

**For the Frontend:**
```bash
cd client
npm install
```

### 4. Database Initialization
1. Open your MySQL client and create the database:
   ```sql
   CREATE DATABASE aerodrive_db;
   ```
2. In the `/server` folder, run the seed script to create tables and add sample data:
   ```bash
   npm run seed
   ```

### 5. Running the Project
You need to run two separate terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The application will be available at **http://localhost:3000**.

---

### 6. Default Credentials (for testing)
- **Manager:** 555-6666 / password123
- **Customer:** 555-1111 / testpass123
- **Clerk:** 555-2222 / password123
- **Mechanic:** 555-3333 / password123
