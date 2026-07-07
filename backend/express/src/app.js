const express = require('express');
const userRouter = require('./routers/user-router');
const taskRouter = require('./routers/task-router');
const connectDatabase = require('./database/mongoose');
const { allowResponse } = require('./middleware/response-cors');

const app = express();
app.use(allowResponse);

app.use(express.json());
app.use(express.static('public'));
app.use(userRouter);
app.use(taskRouter);
connectDatabase().catch(console.error);

module.exports = { app };
