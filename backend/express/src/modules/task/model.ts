import { type HydratedDocument, Schema, Model, model } from 'mongoose';
import z from 'zod';

import type { ModelType } from '@/lib/util/types';

import { _id } from '@/lib/util';

export type TaskModel = Model<Task['task'], object, TaskMethods> & TaskStatics;
export type TaskDocument = HydratedDocument<Task['task']>;
export type Task = ModelType<typeof taskModel>;
export type TaskStatics = object;
export type TaskMethods = object;

export const task = z.object({
  description: z.string({ error: 'Description should be valid.' }),
  completed: z.boolean().default(false),
  owner: _id,
  _id
});

export const taskModel = {
  taskPayload: task.partial(),
  tasks: z.array(task),
  task
} as const;

export const Task = model<Task['task'], TaskModel>(
  'Task',
  new Schema<Task['task'], TaskModel, TaskMethods>(
    {
      owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
      description: { required: true, type: String, trim: true },
      completed: { default: false, type: Boolean, trim: true }
    },
    { timestamps: true }
  )
);
