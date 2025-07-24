const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');

// @route   GET api/mood
// @desc    Get mood entries
// @access  Private
router.get('/', moodController.getMoods);

// @route   POST api/mood
// @desc    Add mood entry
// @access  Private
router.post('/', moodController.addMood);

module.exports = router;