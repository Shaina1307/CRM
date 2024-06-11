import React, { useState, useEffect } from 'react';
import { getCampaigns } from '../../services/api';
import './CampaignList.css';

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
      <table className="table">
        <thead>
          <tr>
            <th>Message</th>
            <th>Sent At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign._id}>
              <td>{campaign.message}</td>
              <td>{new Date(campaign.sentAt).toLocaleString()}</td>
              <td>{campaign.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignList;
