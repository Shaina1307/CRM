import React, { useState } from 'react';
import { createAudience } from '../../services/api';

const AudienceForm = () => {
  const [rules, setRules] = useState({});
  const [message, setMessage] = useState('');

  const handleRuleChange = (e) => {
    const { name, value } = e.target;
    setRules({ ...rules, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAudience({ rules, message });
      alert('Audience created successfully');
      setRules({});
      setMessage('');
    } catch (err) {
      alert('Error creating audience');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Render input fields for defining audience rules */}
      <input
        type="text"
        name="totalSpend"
        placeholder="Total Spend"
        value={rules.totalSpend || ''}
        onChange={handleRuleChange}
      />
      <input
        type="number"
        name="numVisits"
        placeholder="Number of Visits"
        value={rules.numVisits || ''}
        onChange={handleRuleChange}
      />
      {/* Add more input fields as needed */}

      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit">Create Audience</button>
    </form>
  );
};

export default AudienceForm;