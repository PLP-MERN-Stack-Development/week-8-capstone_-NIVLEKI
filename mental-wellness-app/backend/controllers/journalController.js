const JournalEntry = require('../models/JournalEntry');

exports.getEntries = async (req, res) => {
  const userId = req.user.id;

  try {
    const entries = await JournalEntry.find({ userId }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.createEntry = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const newEntry = new JournalEntry({
      userId,
      title,
      content
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateEntry = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const entryId = req.params.id;

  try {
    let entry = await JournalEntry.findById(entryId);

    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }

    // Check if user owns the entry
    if (entry.userId.toString() !== userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    entry.title = title || entry.title;
    entry.content = content || entry.content;

    await entry.save();
    res.json(entry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteEntry = async (req, res) => {
  const userId = req.user.id;
  const entryId = req.params.id;

  try {
    const entry = await JournalEntry.findById(entryId);

    if (!entry) {
      return res.status(404).json({ msg: 'Entry not found' });
    }

    // Check if user owns the entry
    if (entry.userId.toString() !== userId) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await entry.remove();
    res.json({ msg: 'Entry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};