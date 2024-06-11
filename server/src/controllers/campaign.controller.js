const { validationResult, body } = require('express-validator');
const CommunicationLog = require('../models/CommunicationLog');
const Customer = require('../models/Customer');
const queueService = require('../services/queue.service');

exports.createAudience = async (req, res) => {
  try {
    // Validation
    await validateCreateAudienceRequest(req);

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

exports.checkAudienceSize = async (req, res) => {
  try {
    await validateCreateAudienceRequest(req);

    const { rules } = req.body;
    const audience = await getAudienceSize(rules);
    
    res.json({ audienceSize: audience.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const validateCreateAudienceRequest = async (req) => {
  const validations = [
    body('rules').isArray().withMessage('Rules must be an array'),
    body('rules.*.field').exists().withMessage('Each rule must have a field').isString().withMessage('Field must be a string'),
    body('rules.*.operator').exists().withMessage('Each rule must have an operator').isString().withMessage('Operator must be a string'),
    body('rules.*.value').exists().withMessage('Each rule must have a value'),
    body('message').exists().withMessage('Message is required').isString().withMessage('Message must be a string'),
  ];

  await Promise.all(validations.map(validation => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error(errors.array().map(error => error.msg).join(', '));
  }
};

const getAudienceSize = async (rules) => {
  const query = {};

  rules.forEach(rule => {
    switch (rule.field) {
      case 'totalSpend':
        query.totalSpend = { [getMongoOperator(rule.operator)]: parseFloat(rule.value) };
        break;
      case 'numVisits':
        query.numVisits = { [getMongoOperator(rule.operator)]: parseInt(rule.value) };
        break;
      case 'lastVisitDate':
        const date = new Date(rule.value);
        query.lastVisitDate = { [getMongoOperator(rule.operator)]: date };
        break;
      default:
        throw new Error(`Unsupported field: ${rule.field}`);
    }
  });

  const customers = await Customer.find(query);
  const audience = customers.map(customer => ({
    name: customer.name,
    email: customer.email,
  }));

  return audience;
};

const getMongoOperator = (operator) => {
  switch (operator) {
    case '>':
      return '$gt';
    case '>=':
      return '$gte';
    case '<':
      return '$lt';
    case '<=':
      return '$lte';
    case '=':
      return '$eq';
    case '!=':
      return '$ne';
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
};

const sendCampaign = async (communicationLog) => {
  // Simulate sending the campaign to a dummy vendor API
  const vendorResponses = [
    { id: communicationLog._id, status: 'SENT' },
    { id: communicationLog._id, status: 'FAILED' },
    // Add more dummy responses as needed
  ];

  for (const response of vendorResponses) {
    await queueService.publishMessage({
      type: 'UPDATE_COMMUNICATION_LOG',
      payload: response,
    });
  }
};
