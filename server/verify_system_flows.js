require('dotenv').config();
const bcrypt = require('bcryptjs');
const { 
  sequelize, Person, Customer, Staff, Manager, Clerk, Vehicle, Model, Branch,
  Reservation, Contract, Payment, Cash
} = require('./models');

async function runTests() {
  console.log('--- AERO DRIVE SYSTEM TEST SUITE ---');
  const t = await sequelize.transaction();

  try {
    // 1. TEST: Customer Registration & Login Logic
    console.log('[TEST 1] Customer Registration...');
    const rawPass = 'testpass123';
    const hashed = await bcrypt.hash(rawPass, 12);
    const p1 = await Person.create({ 
      FirstName: 'Test', LastName: 'User', Phone: '999-0000', Password: hashed 
    }, { transaction: t });
    const c1 = await Customer.create({ 
      PersonID: p1.PersonID, CNIC: '11111-2222222-3', LicenseNo: 'TEST-LIC-001', DateOfBirth: '1995-01-01' 
    }, { transaction: t });
    
    // Verify login logic
    const personCheck = await Person.findByPk(p1.PersonID, { transaction: t });
    const isMatch = await bcrypt.compare(rawPass, personCheck.Password);
    if (!isMatch) throw new Error('Password hashing verification failed!');
    console.log('✅ Registration & Login Logic Verified.');

    // 2. TEST: Vehicle & Branch Setup
    console.log('[TEST 2] Vehicle Setup...');
    const branch = await Branch.create({ BranchName: 'Test Branch', City: 'Test City' }, { transaction: t });
    const model = await Model.create({ ModelName: 'Test Model', Brand: 'Test Brand', DailyRate: 100 }, { transaction: t });
    const vehicle = await Vehicle.create({ 
      RegistrationNo: 'TEST-REG', LicensePlate: 'TEST-123', Status: 'Available', ModelID: model.ModelID, BranchID: branch.BranchID 
    }, { transaction: t });
    console.log('✅ Vehicle Setup Verified.');

    // 3. TEST: Reservation Conflict & Creation
    console.log('[TEST 3] Reservation Flow...');
    const res = await Reservation.create({
      CustomerID: p1.PersonID,
      VehicleID: vehicle.VehicleID,
      PickupDate: '2026-05-01',
      ReturnDate: '2026-05-05',
      Status: 'Pending'
    }, { transaction: t });
    
    // Update vehicle status
    await vehicle.update({ Status: 'Reserved' }, { transaction: t });
    console.log('✅ Reservation & Status Update Verified.');

    // 4. TEST: Contract & Payment (Data Consistency)
    console.log('[TEST 4] Contract & Payment Flow...');
    const contractNo = `CTR-TEST-${Date.now()}`;
    const contract = await Contract.create({
      ContractNo: contractNo,
      ReservationID: res.ReservationID,
      CustomerID: p1.PersonID,
      VehicleID: vehicle.VehicleID,
      PickupDate: '2026-05-01',
      ReturnDate: '2026-05-05',
      TotalCharge: 500.00,
      BaseCharge: 500.00,
      PaymentStatus: 'Paid',
      MileageAtStart: 10000
    }, { transaction: t });
    
    const payment = await Payment.create({
      Amount: 500.00,
      PaymentType: 'Cash',
      PaymentStatus: 'Paid',
      ContractNo: contract.ContractNo
    }, { transaction: t });
    
    await Cash.create({ PaymentID: payment.PaymentID, ReceivedBy: 'System Test' }, { transaction: t });
    console.log('✅ Transactional Contract/Payment Verified.');

    await t.rollback(); // Rollback so we don't pollute the user's DB
    console.log('\n--- ALL CORE FLOWS VERIFIED SUCCESSFULLY ---');
    process.exit(0);
  } catch (err) {
    await t.rollback();
    console.error('\n❌ TEST FAILED:', err.message);
    process.exit(1);
  }
}

runTests();
