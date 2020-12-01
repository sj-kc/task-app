const express = require('express');
const router = new express.Router();
const User = require('../models/user');

// Create User
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body);
    const token = await user.generateToken();

    res.send({ user, token });
  } catch ({ message }) {
    res.status(400).send(message);
  }
});

module.exports = router;
