import { type HydratedDocument, Schema, Types, model } from 'mongoose';
import z from 'zod';

import type { ModelType } from '@/lib/util/types';

export type TaskDocument = HydratedDocument<Task['task']>;
export type Task = ModelType<typeof taskModel>;

export const task = z.object({
  description: z.string({ error: 'Description should be valid.' }),
  completed: z.boolean().default(false),
  owner: z.instanceof(Types.ObjectId),
  _id: z.instanceof(Types.ObjectId)
});

export const taskModel = { tasks: z.array(task), task } as const;

export const Task = model(
  'Task',
  new Schema<TaskDocument>(
    {
      owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
      description: { required: true, type: String, trim: true },
      completed: { default: false, type: Boolean, trim: true }
    },
    { timestamps: true }
  )
);
