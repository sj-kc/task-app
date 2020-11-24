require('./db/mongoose');
const express = require('express');
const app = express();

const User = require('./models/user');

app.use(express.json());

app.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send({ user });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(process.env.PORT);
