const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(404).send();
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) return res.status(404).send();
    res.send({ task });
  } catch (error) {
    res.status(500).send();
  }
});

// /tasks?completed=true
// /tasks?sortBy=createdAt:des
// /tasks?limit=10&skip=20
router.get('/tasks/', auth, async (req, res) => {
  const match = {};
  if (req.query.completed || req.query.completed === false) {
    match['completed'] = req.query.completed === 'true';
  }

  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  const options = {
    limit: parseInt(req.query.limit),
    skip: parseInt(req.query.skip),
    sort,
  };

  try {
    await req.user
      .populate({
        path: 'tasks',
        match,
        options,
      })
      .execPopulate();

    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  const allowedUpdates = ['description', 'completed'];
  const updates = Object.keys(req.body);

  const isValid = updates.every((update) => allowedUpdates.includes(update));
  if (!isValid) res.status(400).send({ error: 'Invalid update' });

  try {
    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) return res.status(400).send();
    updates.forEach((update) => (task[update] = req.body[update]));

    await task.save();
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
