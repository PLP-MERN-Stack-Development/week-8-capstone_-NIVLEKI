const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');

// @route   GET api/journal
// @desc    Get journal entries
// @access  Private
router.get('/', journalController.getEntries);

// @route   POST api/journal
// @desc    Create journal entry
// @access  Private
router.post('/', journalController.createEntry);

// @route   PUT api/journal/:id
// @desc    Update journal entry
// @access  Private
router.put('/:id', journalController.updateEntry);

// @route   DELETE api/journal/:id
// @desc    Delete journal entry
// @access  Private
router.delete('/:id', journalController.deleteEntry);

module.exports = router;