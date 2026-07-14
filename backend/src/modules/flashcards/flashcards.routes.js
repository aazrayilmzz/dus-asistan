const express = require('express');
const authenticate = require('../../middleware/auth.middleware');
const flashcardsController = require('./flashcards.controller');

const router = express.Router();

router.use(authenticate);

router.post('/', flashcardsController.create);
router.post('/generate', flashcardsController.generate);
router.get('/', flashcardsController.list);
router.put('/:id', flashcardsController.update);
router.patch('/:id/review', flashcardsController.review);
router.delete('/:id', flashcardsController.remove);

module.exports = router;
