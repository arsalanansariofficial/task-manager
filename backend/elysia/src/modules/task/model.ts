import z from 'zod';

import type { ModelType } from '@/lib/util/types';

import { type SchemaSelect, Status } from '@/lib/db/schema';
import { toFactoryResults } from '@/lib/util';
import { schema } from '@/lib/util/schema';

function task() {
  return z
    .toZod<SchemaSelect['task']>()(
      z.object(
        {
          status: z
            .enum(
              Status,
              `status should be valid, ex: ${Object.values(Status)}.`
            )
            .default(Status.incomplete)
            .nullable(),
          description: schema.string('description').nullable(),
          createdAt: schema.date('createdAt'),
          updatedAt: schema.date('updatedAt'),
          userId: schema.uuid('userId'),
          title: schema.string('title'),
          id: schema.uuid('id')
        },
        'task should be a valid object.'
      )
    )
    .meta({ title: 'task' });
}

export const model = toFactoryResults({ task });
export type Model = ModelType<typeof model>;
