const bcrypt = require('bcryptjs');
const { sequelize, Person, Customer, Staff, Manager, Branch, Model, Vehicle, Car, Bike, Truck } = require('../models');

async function seed() {
  try {
    // Note: We assume the database aerodrive_db exists.
    // Sync models
    await sequelize.sync({ force: true });
    console.log('Database synced.');

    // Create v_customer view
    await sequelize.query(`
      CREATE OR REPLACE VIEW v_customer AS
      SELECT c.*, p.FirstName, p.LastName, p.Phone, p.Street, p.City, p.ZipCode,
             TIMESTAMPDIFF(YEAR, c.DateOfBirth, CURDATE()) AS Age
      FROM customer c
      JOIN person p ON c.PersonID = p.PersonID;
    `);
    console.log('v_customer view created.');

    const passwordHash = await bcrypt.hash('password123', 12);

    // Seed Branches
    const branches = await Branch.bulkCreate([
      { BranchName: 'Downtown Hub', Street: '123 Main St', City: 'Metropolis', ZipCode: '10001', Phone: '555-0101' },
      { BranchName: 'Airport Hub', Street: 'Terminal 1 Road', City: 'Metropolis', ZipCode: '10002', Phone: '555-0102' }
    ]);

    // Seed Models
    const models = await Model.bulkCreate([
      { ModelName: 'Civic', Brand: 'Honda', Category: 'Sedan', SeatingCapacity: 5, Transmission: 'Automatic', FuelAverage: 14.5, DailyRate: 50.00 },
      { ModelName: 'Ninja', Brand: 'Kawasaki', Category: 'Sport', SeatingCapacity: 2, Transmission: 'Manual', FuelAverage: 20.0, DailyRate: 35.00 },
      { ModelName: 'F-150', Brand: 'Ford', Category: 'Pickup', SeatingCapacity: 5, Transmission: 'Automatic', FuelAverage: 10.0, DailyRate: 80.00 }
    ]);

    // Seed Vehicles
    const vehicles = await Vehicle.bulkCreate([
      { RegistrationNo: 'REG-101', LicensePlate: 'ABC-123', Mileage: 15000, Status: 'Available', FuelType: 'Petrol', Year: 2022, Color: 'Black', CurrentCity: 'Metropolis', ParkingSpot: 'A1', ModelID: models[0].ModelID, BranchID: branches[0].BranchID },
      { RegistrationNo: 'REG-102', LicensePlate: 'XYZ-987', Mileage: 25000, Status: 'Available', FuelType: 'Petrol', Year: 2021, Color: 'White', CurrentCity: 'Metropolis', ParkingSpot: 'A2', ModelID: models[0].ModelID, BranchID: branches[0].BranchID },
      { RegistrationNo: 'REG-201', LicensePlate: 'MOTO-01', Mileage: 5000, Status: 'Available', FuelType: 'Petrol', Year: 2023, Color: 'Green', CurrentCity: 'Metropolis', ParkingSpot: 'B1', ModelID: models[1].ModelID, BranchID: branches[1].BranchID },
      { RegistrationNo: 'REG-301', LicensePlate: 'TRK-001', Mileage: 45000, Status: 'Available', FuelType: 'Diesel', Year: 2020, Color: 'Blue', CurrentCity: 'Metropolis', ParkingSpot: 'C1', ModelID: models[2].ModelID, BranchID: branches[1].BranchID },
      { RegistrationNo: 'REG-302', LicensePlate: 'TRK-002', Mileage: 10000, Status: 'Rented', FuelType: 'Diesel', Year: 2023, Color: 'White', CurrentCity: 'Metropolis', ParkingSpot: 'C2', ModelID: models[2].ModelID, BranchID: branches[0].BranchID }
    ]);

    // Subtypes for vehicles
    await Car.bulkCreate([
      { VehicleID: vehicles[0].VehicleID, Doors: 4, TrunkCapacity: 15.0, ACType: 'Climate Control', BootSpace: 15.0 },
      { VehicleID: vehicles[1].VehicleID, Doors: 4, TrunkCapacity: 15.0, ACType: 'Climate Control', BootSpace: 15.0 }
    ]);
    await Bike.bulkCreate([
      { VehicleID: vehicles[2].VehicleID, EngineCapacity: 600, BikeType: 'Sport', HelmetIncluded: true }
    ]);
    await Truck.bulkCreate([
      { VehicleID: vehicles[3].VehicleID, LoadCapacity: 5000.0, Axles: 2, CargoType: 'Open', Height: 6.5 },
      { VehicleID: vehicles[4].VehicleID, LoadCapacity: 5000.0, Axles: 2, CargoType: 'Closed', Height: 7.0 }
    ]);

    // Seed People / Customers
    const c1 = await Person.create({ FirstName: 'John', LastName: 'Doe', Phone: '555-1111', Password: passwordHash });
    await Customer.create({ PersonID: c1.PersonID, CNIC: '1234567890123', LicenseNo: 'LIC-001', DateOfBirth: '1990-05-15', Occupation: 'Engineer' });

    const c2 = await Person.create({ FirstName: 'Jane', LastName: 'Smith', Phone: '555-2222', Password: passwordHash });
    await Customer.create({ PersonID: c2.PersonID, CNIC: '1234567890124', LicenseNo: 'LIC-002', DateOfBirth: '1985-08-20', Occupation: 'Doctor' });

    const c3 = await Person.create({ FirstName: 'Ali', LastName: 'Khan', Phone: '555-3333', Password: passwordHash });
    await Customer.create({ PersonID: c3.PersonID, CNIC: '1234567890125', LicenseNo: 'LIC-003', DateOfBirth: '1998-12-05', Occupation: 'Student' });

    // Seed Staff & Manager
    const s1 = await Person.create({ FirstName: 'Alice', LastName: 'Johnson', Phone: '555-4444', Password: passwordHash });
    await Staff.create({ PersonID: s1.PersonID, Position: 'Clerk', HireDate: '2022-01-10', Salary: 3000.00, ShiftType: 'Morning', BranchID: branches[0].BranchID });

    const s2 = await Person.create({ FirstName: 'Bob', LastName: 'Williams', Phone: '555-5555', Password: passwordHash });
    await Staff.create({ PersonID: s2.PersonID, Position: 'Mechanic', HireDate: '2021-06-15', Salary: 4000.00, ShiftType: 'Evening', BranchID: branches[1].BranchID });
    await Mechanic.create({ PersonID: s2.PersonID, Specialization: 'General', ToolKit: 'Master Pro Kit', WorkshopAssigned: 'Main Workshop' });

    const m1 = await Person.create({ FirstName: 'Michael', LastName: 'Scott', Phone: '555-6666', Password: passwordHash });
    await Staff.create({ PersonID: m1.PersonID, Position: 'Manager', HireDate: '2015-03-01', Salary: 7000.00, ShiftType: 'Morning', BranchID: branches[0].BranchID });
    await Manager.create({ PersonID: m1.PersonID, Department: 'Operations', ManagedBranch: 'Downtown Hub', BonusPercentage: 10.0 });

    console.log('Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
}

seed();
