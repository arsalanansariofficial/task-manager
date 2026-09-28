import z from 'zod';

import type { ModelType } from '@/lib/util/types';

import { model } from '@/modules/task/model';
import { schema } from '@/lib/util/schema';

export type Payload = ModelType<typeof payload>;

const query = z
  .object(
    {
      pageSize: z.coerce.number('pageSize should be a valid number.'),
      page: z.coerce.number('page should be a valid number.')
    },
    'params should be a valid object.'
  )
  .partial();

const taskId = z.object(
  { id: schema.uuid('id') },
  'taskId params should be valid object.'
);

const task = model.task.partial().extend({ title: model.task.shape.title });
const patchTask = model.task.partial();

export const payload = { patchTask, taskId, query, task } as const;
