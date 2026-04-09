const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret-key', {
    expiresIn: '30d'
  });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const newUser = await User.create({ name, email, password });
    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: { user: { id: newUser._id, name, email } }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
      data: { user: { id: user._id, name: user.name, email } }
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
});

module.exports = router;
