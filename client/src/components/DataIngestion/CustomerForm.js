import React, { useState } from 'react';
import { createCustomer } from '../../services/api';

const CustomerForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCustomer({ name, email });
      alert('Customer created successfully');
      setName('');
      setEmail('');
    } catch (err) {
      alert('Error creating customer');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Create Customer</button>
    </form>
  );
};

export default CustomerForm;