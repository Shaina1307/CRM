import React, { useState, useEffect } from 'react';
import { getCampaigns } from '../../services/api';

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
    <div>
      <h2>Past Campaigns</h2>
      {campaigns.map((campaign) => (
        <div key={campaign._id}>
          <h3>{campaign.message}</h3>
          <p>Sent At: {new Date(campaign.sentAt).toLocaleString()}</p>
          <p>Status: {campaign.status}</p>
          {/* Display additional campaign statistics */}
        </div>
      ))}
    </div>
  );
};

export default CampaignList;