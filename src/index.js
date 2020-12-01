require('./db/mongoose');
const express = require('express');
const app = express();
const userRoute = require('./routes/user');

app.use(express.json());
app.use(userRoute);

app.listen(process.env.PORT);
