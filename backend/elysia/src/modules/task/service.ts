import { and, eq } from 'drizzle-orm';

import type { Payload } from '@/modules/task/payload';

import { schema, task } from '@/lib/db/schema';
import { paginate } from '@/lib/pagination';
import { ApiError } from '@/lib/error';
import { db } from '@/lib/db';

import type { Model } from '../user/model';

async function getAll(params: {
  where: Payload['where'];
  user: Model['user'];
}) {
  const { pageSize, page, ...where } = params.where;
  const { user } = params;

  return await paginate({
    async getData({ offset, limit }) {
      return await db.query.task.findMany({
        orderBy: { createdAt: 'desc', id: 'desc' },
        where: { userId: user.id, ...where },
        offset,
        limit
      });
    },
    async getTotal() {
      return db.$count(task).sync();
    },
    pageSize,
    page
  });
}

async function update(params: {
  body: Payload['update'];
  params: Payload['id'];
}) {
  const { id } = params.params;
  const { body } = params;

  const task = await db.query.task.findFirst({ where: { id } });

  if (!task)
    throw new ApiError({
      message: `Requested task with ${id} does not exist.`
    });

  if (body)
    return db
      .update(schema.task)
      .set(body)
      .where(eq(schema.task.id, id))
      .returning()
      .get();

  return task;
}

async function deleteTask(params: {
  params: Payload['id'];
  user: Model['user'];
}) {
  const { id } = params.params;
  const { user } = params;

  const task = db
    .delete(schema.task)
    .where(and(eq(schema.task.id, id), eq(schema.task.userId, user.id)))
    .returning()
    .get();

  if (!task)
    throw new ApiError({
      message: `Requested task with ${id} for user ${user.id} does not exist.`
    });

  return task;
}

async function get(params: { params: Payload['id']; user: Model['user'] }) {
  const { id } = params.params;
  const { user } = params;

  const task = await db.query.task.findFirst({
    where: { userId: user.id, id }
  });

  if (!task)
    throw new ApiError({
      message: `Requested task with ${id} does not exist.`
    });

  return task;
}

async function create(params: {
  body: Payload['create'];
  user: Model['user'];
}) {
  const { user, body } = params;

  const task = db
    .insert(schema.task)
    .values({ ...body, userId: user.id })
    .returning()
    .get();

  return task;
}

export const service = { deleteTask, getAll, update, create, get };
