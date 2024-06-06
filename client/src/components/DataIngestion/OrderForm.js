import React, { useState } from 'react';
import { createOrder } from '../../services/api';

const OrderForm = () => {
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createOrder({ customer: customerId, amount: parseFloat(amount) });
      alert('Order created successfully');
      setCustomerId('');
      setAmount('');
    } catch (err) {
      alert('Error creating order');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <button type="submit">Create Order</button>
    </form>
  );
};

export default OrderForm;