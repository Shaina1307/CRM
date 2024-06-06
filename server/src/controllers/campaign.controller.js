const CommunicationLog = require('../models/CommunicationLog');
const Customer = require('../models/Customer');

exports.createAudience = async (req, res) => {
  try {
    const { rules, message } = req.body;
    const audience = await getAudienceSize(rules);
    const communicationLog = new CommunicationLog({ audience, message });
    await communicationLog.save();

    // Simulate sending campaign
    sendCampaign(communicationLog);

    res.status(201).json(communicationLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await CommunicationLog.find().sort({ sentAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAudienceSize = async (rules) => {
    let query = {};
  
    if (rules.totalSpend) {
      query.totalSpend = { $gt: parseFloat(rules.totalSpend) };
    }
  
    if (rules.numVisits) {
      query.numVisits = { $gt: parseInt(rules.numVisits) };
    }
  
    if (rules.lastVisitDate) {
      const lastVisitDate = new Date(rules.lastVisitDate);
      const threemonthsAgo = new Date();
      threemonthsAgo.setMonth(threemonthsAgo.getMonth() - 3);
      query.lastVisitDate = { $lt: threemonthsAgo };
    }
  
    const customers = await Customer.find(query);
    const audience = customers.map((customer) => ({
      name: customer.name,
      email: customer.email,
    }));
  
    return audience;
  };
  
  const sendCampaign = async (communicationLog) => {
    // Simulate sending the campaign to a dummy vendor API
    const vendorResponses = [
      { id: communicationLog._id, status: 'SENT' },
      { id: communicationLog._id, status: 'FAILED' },
      // Add more dummy responses as needed
    ];
  
    for (const response of vendorResponses) {
      await publishMessage({
        type: 'UPDATE_COMMUNICATION_LOG',
        payload: response,
      });
    }
  };