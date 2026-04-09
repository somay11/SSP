const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/suggestions', (req, res) => {
  res.json({ success: true, suggestions: [
    'Review your highest-priority tasks first — tackle High items before 10 AM.',
    'Spend the first Pomodoro on your most deadline-critical task.',
    'Use breaks to review notes, not social media.'
  ]});
});

module.exports = router;
