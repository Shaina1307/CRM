// components/HomePage.js
import React from 'react';
import './HomePage.css'; // Import the CSS file for HomePage styling
import { FaUserPlus, FaClipboardList, FaUsers, FaListAlt } from 'react-icons/fa'; // Import icons

const HomePage = () => {
  const features = [
    {
      icon: <FaUserPlus className="feature-icon" />,
      title: "Add a New Customer",
      description: "Effortlessly Add New Customers and Manage Their Profiles Seamlessly",
    },
    {
      icon: <FaClipboardList className="feature-icon" />,
      title: "Create or Add New Orders",
      description:
        "Generate Orders, Monitor Spending,Track Visits, and Analyze Customer Metrics.-All in One Place",
    },
    {
      icon: <FaUsers className="feature-icon" />,
      title: "Build New Audience",
      description:
        "Target the Right People with Precision and Segment Your Customers with Customizable Rules and Preview Audience Size Before Launching Campaigns",
    },
    {
      icon: <FaListAlt className="feature-icon" />,
      title: "Veiw Your Campaign List",
      description:
        "Manage and Track All Your Marketing Efforts All in One Place.",
    },
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">This is a Tour Guide to the App</h1>
        <p className="hero-subtitle">How to Build Effortless customer management and campaign creation.</p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            {feature.icon}
            <h2 className="feature-title">{feature.title}</h2>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
