const MoodEntry = require('../models/MoodEntry');

exports.addMood = async (req, res) => {
  const { mood } = req.body;
  const userId = req.user.id;

  try {
    // Check if mood entry already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingEntry = await MoodEntry.findOne({
      userId,
      date: { $gte: today }
    });

    if (existingEntry) {
      return res.status(400).json({ msg: 'Mood already logged for today' });
    }

    // Create new mood entry
    const moodEntry = new MoodEntry({
      userId,
      mood
    });

    await moodEntry.save();

    res.status(201).json(moodEntry);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getMoods = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get mood entries for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const moods = await MoodEntry.find({
      userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: -1 });

    res.json(moods);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};