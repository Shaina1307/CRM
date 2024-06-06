const Order = require('../models/Order');
const Customer = require('../models/Customer');

exports.createOrder = async (req, res) => {
  try {
    const { customer, amount } = req.body;
    const order = new Order({ customer, amount });
    await order.save();

    // Update customer's totalSpend and numVisits
    const customerObj = await Customer.findById(customer);
    customerObj.totalSpend += amount;
    customerObj.numVisits += 1;
    customerObj.lastVisitDate = new Date();
    await customerObj.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};