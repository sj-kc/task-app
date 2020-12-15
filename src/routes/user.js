const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const { welcome, cancel } = require('../emails/account');

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    welcome(user);
    const token = await user.generateToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body);
    const token = await user.generateToken();

    res.send({ user, token });
  } catch ({ message }) {
    res.status(400).send(message);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      ({ token }) => token !== req.token
    );

    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/users/me', auth, (req, res) => res.send(req.user));

router.patch('/users/me', auth, async (req, res) => {
  const updates = ['name', 'email', 'password'];
  const keys = Object.keys(req.body);
  const isValid = keys.every((key) => updates.includes(key));

  if (!isValid) res.status(400).send({ error: 'Invalid update' });

  try {
    keys.forEach((key) => (req.user[key] = req.body[key]));
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    cancel(req.user);
    res.send(req.user);
  } catch (error) {
    res.status(500).send;
  }
});

module.exports = router;
