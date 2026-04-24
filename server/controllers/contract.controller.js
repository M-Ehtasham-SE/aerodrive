const { Contract, Reservation, Vehicle, Customer, Person, ContractCharge, sequelize } = require('../models');

exports.getContracts = async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [
        { model: Customer, include: [{ model: Person, attributes: ['FirstName', 'LastName'] }] },
        { model: Vehicle, attributes: ['LicensePlate', 'VehicleID'] },
        ContractCharge
      ]
    });
    res.json({ success: true, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contracts', error: error.message });
  }
};

exports.getContractByNo = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.no, {
      include: [Customer, Vehicle, ContractCharge, Reservation]
    });
    if (!contract) return res.status(404).json({ success: false, message: 'Contract not found' });
    res.json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contract', error: error.message });
  }
};

exports.createContract = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { reservationId, mileageAtStart, termsAndConditions } = req.body;

    const reservation = await Reservation.findByPk(reservationId, { include: [Vehicle] });
    if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });

    // Calculate base charge from model daily rate * rental days
    const days = Math.ceil((new Date(reservation.ReturnDate) - new Date(reservation.PickupDate)) / (1000 * 60 * 60 * 24));
    const dailyRate = reservation.Vehicle?.Model?.DailyRate || 0;
    const baseCharge = days * dailyRate;

    const contractNo = `CTR-${Date.now()}`;

    const contract = await Contract.create({
      ContractNo: contractNo,
      PickupDate: reservation.PickupDate,
      ReturnDate: reservation.ReturnDate,
      BaseCharge: baseCharge,
      TotalCharge: baseCharge,
      PaymentStatus: 'Pending',
      MileageAtStart: mileageAtStart,
      TermsAndConditions: termsAndConditions,
      ReservationID: reservationId,
      CustomerID: reservation.CustomerID,
      VehicleID: reservation.VehicleID
    }, { transaction: t });

    // Update reservation status to Active
    await reservation.update({ Status: 'Active' }, { transaction: t });
    // Update vehicle status to Rented
    await Vehicle.update({ Status: 'Rented' }, { where: { VehicleID: reservation.VehicleID }, transaction: t });

    await t.commit();
    res.status(201).json({ success: true, message: 'Contract created', data: contract });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to create contract', error: error.message });
  }
};

exports.closeContract = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { mileageAtEnd } = req.body;
    const contract = await Contract.findByPk(req.params.no);
    if (!contract) return res.status(404).json({ success: false, message: 'Contract not found' });

    await contract.update({ MileageAtEnd: mileageAtEnd, PaymentStatus: 'Paid' }, { transaction: t });
    
    // Reset vehicle to Available
    await Vehicle.update({ Status: 'Available', Mileage: mileageAtEnd }, { where: { VehicleID: contract.VehicleID }, transaction: t });
    
    // Update reservation to Completed
    if (contract.ReservationID) {
      await Reservation.update({ Status: 'Completed' }, { where: { ReservationID: contract.ReservationID }, transaction: t });
    }

    await t.commit();
    res.json({ success: true, message: 'Contract closed', data: contract });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to close contract', error: error.message });
  }
};

exports.addCharge = async (req, res) => {
  try {
    const { chargeDescription, amount } = req.body;
    const contract = await Contract.findByPk(req.params.no);
    if (!contract) return res.status(404).json({ success: false, message: 'Contract not found' });

    const charge = await ContractCharge.create({ ContractNo: req.params.no, ChargeDescription: chargeDescription, Amount: amount });
    
    // Update total charge
    await contract.update({ TotalCharge: parseFloat(contract.TotalCharge) + parseFloat(amount) });
    
    res.status(201).json({ success: true, message: 'Charge added', data: charge });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add charge', error: error.message });
  }
};
