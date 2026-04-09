const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/session', (req, res) => {
  res.json({ success: true, message: 'Timer session logged successfully' });
});

module.exports = router;
