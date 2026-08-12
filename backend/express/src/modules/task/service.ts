import type { SortOrder, Types } from 'mongoose';

import type { UserDocument } from '@/modules/user/model';

import { TaskNotFoundError } from '@/lib/error';
import { Task } from '@/modules/task/model';

async function getTasks({
  query,
  user
}: {
  query: Record<string, unknown>;
  user: UserDocument;
}) {
  return await user.populate<{ tasks: Task['tasks'] }>({
    options: {
      limit: Number(query.limit ?? '10'),
      skip: Number(query.skip ?? '0'),
      sort: getSortFilter(query)
    },
    match: query.completed ? { completed: true } : {},
    path: 'tasks'
  });
}

async function updateTask({
  payload,
  userId,
  _id
}: {
  payload: Task['taskPayload'];
  userId: Types.ObjectId;
  _id: string;
}) {
  const task = await Task.findOne({ owner: userId, _id });

  if (!task)
    throw new TaskNotFoundError([
      { message: `Task with id ${_id} does not exist.`, path: [_id] }
    ]);

  task.set(payload);
  return await task.save();
}

async function deleteTaskById({
  userId,
  _id
}: {
  userId: Types.ObjectId;
  _id: string;
}) {
  const task = await Task.findOneAndDelete({ owner: userId, _id });

  if (!task)
    throw new TaskNotFoundError([
      { message: `Task with id ${_id} does not exist.`, path: [_id] }
    ]);

  return task;
}

async function getTaskById({
  userId,
  _id
}: {
  userId: Types.ObjectId;
  _id: string;
}) {
  const task = await Task.findOne({ owner: userId, _id });

  if (!task)
    throw new TaskNotFoundError([
      { message: `Task with id ${_id} does not exist.`, path: [_id] }
    ]);

  return task;
}

function getSortFilter(query: Record<string, unknown>) {
  const sort: Record<string, SortOrder> = {};

  if (query.sortBy) {
    const [field, direction] = String(query.sortBy).split(':');
    if (field) sort[field] = direction === 'desc' ? -1 : 1;
  }
  return sort;
}

async function create({
  payload,
  userId
}: {
  payload: Task['taskPayload'];
  userId: Types.ObjectId;
}) {
  const task = new Task({ ...payload, owner: userId });
  await task.save();
  return task;
}

export const taskService = {
  deleteTaskById,
  getTaskById,
  updateTask,
  getTasks,
  create
};
