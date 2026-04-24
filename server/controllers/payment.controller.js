const { Payment, Cash, Card, OnlinePayment, Reservation, Contract, sequelize } = require('../models');

exports.getPayments = async (req, res) => {
  try {
    const { status, type } = req.query;
    let whereClause = {};
    if (status) whereClause.PaymentStatus = status;
    if (type) whereClause.PaymentType = type;
    const payments = await Payment.findAll({ where: whereClause, include: [Cash, Card, OnlinePayment] });
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payments', error: error.message });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, { include: [Cash, Card, OnlinePayment] });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch payment', error: error.message });
  }
};

exports.createPayment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { type, amount, reservationId, contractNo, subData } = req.body;
    
    const payment = await Payment.create({
      Amount: amount,
      PaymentType: type,
      PaymentStatus: 'Paid',
      ReservationID: reservationId || null,
      ContractNo: contractNo || null
    }, { transaction: t });

    if (type === 'Cash') {
      await Cash.create({ PaymentID: payment.PaymentID, ...subData }, { transaction: t });
    } else if (type === 'Card') {
      await Card.create({ PaymentID: payment.PaymentID, ...subData }, { transaction: t });
    } else if (type === 'Online') {
      await OnlinePayment.create({ PaymentID: payment.PaymentID, ...subData }, { transaction: t });
    }

    await t.commit();
    res.status(201).json({ success: true, message: 'Payment created', data: payment });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ success: false, message: 'Failed to create payment', error: error.message });
  }
};
