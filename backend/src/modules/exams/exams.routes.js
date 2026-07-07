const express = require('express');
const authenticate = require('../../middleware/auth.middleware');
const examsController = require('./exams.controller');

const router = express.Router();

router.use(authenticate);

router.post('/', examsController.create);
router.get('/', examsController.list);
router.put('/:id', examsController.update);
router.delete('/:id', examsController.remove);

module.exports = router;
