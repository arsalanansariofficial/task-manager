const express = require('express');
const taskRouter = new express.Router();
const { TaskModel } = require('../models/task');
const { authentication } = require('../middleware/authentication');

taskRouter.post('/tasks', authentication, async (request, response) => {
  const task = new TaskModel({
    ...request.body,
    owner: request.user._id
  });
  try {
    response.status(201).send(await task.save());
  } catch (error) {
    response.status(500).send(error);
  }
});

// GET /tasks?complete=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
taskRouter.get('/tasks', authentication, async (request, response) => {
  const match = {};
  const sort = {};
  if (request.query.completed) {
    match.completed = request.query.completed === 'true';
  }
  if (request.query['sortBy']) {
    const sortQuery = request.query['sortBy'].split(':');
    sort[sortQuery[0]] = sortQuery[1] === 'desc' ? -1 : 1;
  }
  try {
    // const tasks = await TaskModel.find({owner: request.user._id});

    // This uses one-to-many relationship from user --> task
    const { tasks } = await request.user
      .populate({
        path: 'tasks',
        match,
        options: {
          limit: parseInt(request.query.limit),
          skip: parseInt(request.query.skip),
          sort
        }
      })
      .execPopulate();

    response.status(200).send(tasks);
  } catch (error) {
    response.status(500).send(error);
  }
});

taskRouter.get('/tasks/:id', authentication, async (request, response) => {
  try {
    const _id = request.params.id;
    const task = await TaskModel.findOne({ _id, owner: request.user._id });
    if (!task) {
      const errorResponse = {
        code: 404,
        message: `No task found with id - ${_id}`
      };
      return response.status(404).send(errorResponse);
    }
    response.status(200).send(task);
  } catch (error) {
    response.status(500).send(error);
  }
});

taskRouter.patch('/tasks/:id', authentication, async (request, response) => {
  const keys = Object.keys(request.body);
  const allowedKeys = ['completed', 'description'];
  const isValidTask = keys.every(key => allowedKeys.includes(key));

  if (!isValidTask) {
    const errorResponse = {
      code: 400,
      message: 'Invalid updates'
    };
    return response.status(400).send(errorResponse);
  }

  try {
    const _id = request.params.id;
    const task = await TaskModel.findOne({ _id, owner: request.user._id });

    if (!task) {
      const errorResponse = {
        code: 404,
        message: `No task found with id - ${_id}`
      };
      return response.status(404).send(errorResponse);
    }

    keys.forEach(key => (task[key] = request.body[key]));
    await task['save']();

    response.status(201).send(task);
  } catch (error) {
    response.status(500).send(error);
  }
});

taskRouter.delete('/tasks/:id', authentication, async (request, response) => {
  try {
    const _id = request.params.id;
    const task = await TaskModel.findOneAndDelete({
      _id,
      owner: request.user._id
    });
    if (!task) {
      const errorResponse = {
        code: 404,
        message: `No task found with id - ${_id}`
      };
      return response.status(404).send(errorResponse);
    }
    response.status(201).send(task);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = taskRouter;
