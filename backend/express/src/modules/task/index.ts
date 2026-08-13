import { type Response, type Request, Router } from 'express';

import { taskModel, Task } from '@/modules/task/model';
import { taskService } from '@/modules/task/service';
import { HttpStatusCodes } from '@/lib/util/types';
import { auth } from '@/lib/middlewares/auth';

export const taskRoutes = Router();

taskRoutes.patch(
  '/tasks/:id',
  auth,
  async (
    request: Request<{ id: string }>,
    response: Response<Task['task']>
  ) => {
    const task = await taskService.updateTask({
      payload: taskModel.taskPayload.parse(request.body),
      userId: request.user._id,
      _id: request.params.id
    });
    response.status(201).json(taskModel.task.parse(task));
  }
);

taskRoutes.delete(
  '/tasks/:id',
  auth,
  async (
    request: Request<{ id: string }>,
    response: Response<Task['task']>
  ) => {
    const task = await taskService.deleteTaskById({
      userId: request.user._id,
      _id: request.params.id
    });
    response.status(201).json(taskModel.task.parse(task));
  }
);

taskRoutes.get(
  '/tasks/:id',
  auth,
  async (
    request: Request<{ id: string }>,
    response: Response<Task['task']>
  ) => {
    const task = await taskService.getTaskById({
      userId: request.user._id,
      _id: request.params.id
    });
    response.status(HttpStatusCodes.ok).json(taskModel.task.parse(task));
  }
);

taskRoutes.post(
  '/tasks',
  auth,
  async (
    request: Request<object, object, Task['taskPayload']>,
    response: Response<Task['task']>
  ) => {
    const task = await taskService.create({
      payload: taskModel.taskPayload.parse(request.body),
      userId: request.user._id
    });
    response.status(HttpStatusCodes.created).json(taskModel.task.parse(task));
  }
);

taskRoutes.get(
  '/tasks',
  auth,
  async (request: Request, response: Response<Task['tasks']>) => {
    const user = await taskService.getTasks({
      query: request.query,
      user: request.user
    });
    response.status(HttpStatusCodes.ok).json(taskModel.tasks.parse(user.tasks));
  }
);
