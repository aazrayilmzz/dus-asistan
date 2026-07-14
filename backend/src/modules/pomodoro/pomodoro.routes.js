const express = require('express');
const authenticate = require('../../middleware/auth.middleware');
const pomodoroController = require('./pomodoro.controller');

const router = express.Router();

router.use(authenticate);

router.post('/start', pomodoroController.start);
router.patch('/:id/complete', pomodoroController.complete);
router.patch('/:id/abandon', pomodoroController.abandon);
router.get('/active', pomodoroController.active);
router.get('/streak', pomodoroController.streak);
router.get('/weekly-summary', pomodoroController.weeklySummary);
router.get('/', pomodoroController.history);

module.exports = router;
