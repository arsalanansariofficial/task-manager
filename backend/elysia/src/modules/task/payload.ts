import z from 'zod';

import type { ModelType } from '@/lib/util/types';

import { toFactoryResults, toQuery, clean } from '@/lib/util';
import { model } from '@/modules/task/model';
import { schema } from '@/lib/util/schema';

function where() {
  return model.task
    .extend(schema.pageQuery().shape)
    .partial()
    .transform(toQuery);
}

function id() {
  return z.object(
    { id: schema.uuid('id') },
    'taskId params should be valid object.'
  );
}

function create() {
  return model.task.partial().required({ title: true });
}

function update() {
  return model.task.partial().transform(clean);
}

function paginate() {
  return schema.pagination(model.task);
}

function read() {
  return model.task;
}

export const payload = toFactoryResults({
  paginate,
  create,
  update,
  where,
  read,
  id
});

export type Payload = ModelType<typeof payload>;
