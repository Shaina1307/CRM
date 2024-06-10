import React, { useState, useEffect } from 'react';
import { getCampaigns } from '../../services/api';
import './CampaignList.css'; // Import the CSS file

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const campaignsData = await getCampaigns();
        setCampaigns(campaignsData.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="campaign-list-container">
      <h2 className="campaign-list-title">Past Campaigns</h2>
      <div className="campaign-cards">
        {campaigns.map((campaign) => (
          <div key={campaign._id} className="campaign-card">
            <h3 className="campaign-message">{campaign.message}</h3>
            <p className="campaign-details">
              <strong>Sent At:</strong> {new Date(campaign.sentAt).toLocaleString()}
            </p>
            <p className="campaign-details">
              <strong>Status:</strong> {campaign.status}
            </p>
            {/* Display additional campaign statistics */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;
