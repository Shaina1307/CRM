import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import CustomerForm from '../components/DataIngestion/CustomerForm';
import OrderForm from '../components/DataIngestion/OrderForm';
import AudienceForm from '../components/DataIngestion/AudienceForm';
import CampaignList from '../components/CampaignListing/CampaignList';
import './Home.css';

const Home = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout(); // Wait for logout operation to complete
    navigate('/login', { replace: true }); // Navigate to login page immediately
  };

  return (
    <div>
      <nav className="navbar">
        <ul>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
          <li>
            <Link to="/home/customers">Create Customer</Link>
          </li>
          <li>
            <Link to="/home/orders">Create Order</Link>
          </li>
          <li>
            <Link to="/home/audience">Create Audience</Link>
          </li>
          <li>
            <Link to="/home/campaigns">Campaign List</Link>
          </li>
        </ul>
      </nav>

      <div className="content">
        <h1 className="page-title">Welcome to the Dashboard</h1>
        <Routes>
          <Route path="/customers" element={<CustomerForm />} />
          <Route path="/orders" element={<OrderForm />} />
          <Route path="/audience" element={<AudienceForm />} />
          <Route path="/campaigns" element={<CampaignList />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
