import React, { useState } from 'react';
import { createAudience } from '../../services/api';
import './AudienceForm.css';

const AudienceForm = () => {
  const [rules, setRules] = useState({});
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleRuleChange = (e) => {
    const { name, value } = e.target;
    setRules({ ...rules, [name]: value });
  };

  const validate = () => {
    const newErrors = {};

    if (!rules.totalSpend || isNaN(rules.totalSpend) || rules.totalSpend <= 0) {
      newErrors.totalSpend = 'Total Spend must be a positive number';
    }

    if (!rules.numVisits || isNaN(rules.numVisits) || rules.numVisits <= 0) {
      newErrors.numVisits = 'Number of Visits must be a positive integer';
    }

    if (!message.trim()) {
      newErrors.message = 'Message is required';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createAudience({ rules, message });
      alert('Audience created successfully');
      setRules({});
      setMessage('');
      setErrors({});
    } catch (err) {
      alert('Error creating audience');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="totalSpend"
            placeholder="Total Spend"
            value={rules.totalSpend || ''}
            onChange={handleRuleChange}
          />
          {errors.totalSpend && <div className="error">{errors.totalSpend}</div>}
        </div>
        
        <div className="form-group">
          <input
            type="number"
            name="numVisits"
            placeholder="Number of Visits"
            value={rules.numVisits || ''}
            onChange={handleRuleChange}
          />
          {errors.numVisits && <div className="error">{errors.numVisits}</div>}
        </div>

        {/* Add more input fields as needed */}

        <div className="form-group">
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          {errors.message && <div className="error">{errors.message}</div>}
        </div>

        <button type="submit" disabled={Object.keys(errors).length > 0}>Create Audience</button>
      </form>
    </div>
  );
};

export default AudienceForm;
