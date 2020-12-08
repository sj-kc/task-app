require('./db/mongoose');
const express = require('express');
const app = express();
const userRoute = require('./routes/user');
const taskRoute = require('./routes/task');

app.use(express.json());
app.use(userRoute);
app.use(taskRoute);

app.listen(process.env.PORT);
