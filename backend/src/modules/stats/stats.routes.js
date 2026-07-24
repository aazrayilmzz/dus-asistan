const express = require('express');
const authenticate = require('../../middleware/auth.middleware');
const statsController = require('./stats.controller');

const router = express.Router();

router.use(authenticate);

router.get('/streak', statsController.streak);
router.get('/weekly-summary', statsController.weeklySummary);

module.exports = router;
