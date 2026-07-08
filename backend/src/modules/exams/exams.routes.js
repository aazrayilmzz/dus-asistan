const express = require('express');
const authenticate = require('../../middleware/auth.middleware');
const examsController = require('./exams.controller');
const examSubjectResultsController = require('./examSubjectResults.controller');

const router = express.Router();

router.use(authenticate);

router.post('/', examsController.create);
router.get('/', examsController.list);
router.put('/:id', examsController.update);
router.delete('/:id', examsController.remove);

router.get('/subjects/summary', examSubjectResultsController.summary);

router.post('/:examId/subjects', examSubjectResultsController.create);
router.get('/:examId/subjects', examSubjectResultsController.list);
router.put('/subjects/:id', examSubjectResultsController.update);
router.delete('/subjects/:id', examSubjectResultsController.remove);

module.exports = router;
