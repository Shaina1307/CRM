import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerForm from './components/DataIngestion/CustomerForm';
import OrderForm from './components/DataIngestion/OrderForm';
import AudienceForm from './components/DataIngestion/AudienceForm';
import CampaignList from './components/CampaignListing/CampaignList';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/customers">Create Customer</Link>
            </li>
            <li>
              <Link to="/orders">Create Order</Link>
            </li>
            <li>
              <Link to="/audience">Create Audience</Link>
            </li>
            <li>
              <Link to="/campaigns">Campaign List</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/customers" element={<CustomerForm />} />
          <Route path="/orders" element={<OrderForm />} />
          <Route path="/audience" element={<AudienceForm />} />
          <Route path="/campaigns" element={<CampaignList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;