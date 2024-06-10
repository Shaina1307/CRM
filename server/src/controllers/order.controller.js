const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Customer = require('../models/Customer');

exports.validateOrder = [
  body('customerId').isMongoId().withMessage('Invalid customer ID'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number')
];

exports.createOrder = async (req, res) => {
  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { customerId, amount } = req.body;
    const order = new Order({ customerId, amount });
    await order.save();

    // Update customer's totalSpend and numVisits
    const customerObj = await Customer.findById(customerId);
    if (!customerObj) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    customerObj.totalSpend += amount;
    customerObj.numVisits += 1;
    customerObj.lastVisitDate = new Date();
    await customerObj.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
