const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaign.controller');

router.post('/audience', campaignController.createAudience);
router.get('/', campaignController.getCampaigns);

module.exports = router;