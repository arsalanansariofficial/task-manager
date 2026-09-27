import { and, eq } from 'drizzle-orm';

import type { Payload } from '@/modules/task/payload';

import { type SchemaSelect, task } from '@/lib/db/schema';
import { TaskNotFoundError } from '@/lib/error';
import { db } from '@/lib/db';

async function get({ userId, id }: { userId: string; id?: string }) {
  if (id) {
    const task = await db.query.task.findFirst({ where: { userId, id } });

    if (!task)
      throw new TaskNotFoundError([
        {
          message: `Requested task with ${id} for user ${userId} does not exist.`,
          path: [id, userId]
        }
      ]);

    return task;
  }

  return await db.query.task.findMany({ where: { userId } });
}

async function deleteTask({ userId, id }: { userId: string; id: string }) {
  const [$task] = await db
    .delete(task)
    .where(and(eq(task.id, id), eq(task.userId, userId)))
    .returning();

  if (!$task)
    throw new TaskNotFoundError([
      {
        message: `Requested task with ${id} for user ${userId} does not exist.`,
        path: [id, userId]
      }
    ]);

  return $task;
}

async function update(args: { payload: Payload['patchTask']; id: string }) {
  const [$task] = await db
    .update(task)
    .set(args.payload)
    .where(eq(task.id, args.id))
    .returning();

  return $task as SchemaSelect['task'];
}

async function create(args: { payload: Payload['task']; userId: string }) {
  const [$task] = await db
    .insert(task)
    .values({ ...args.payload, userId: args.userId })
    .returning();

  return $task as SchemaSelect['task'];
}

export const taskService = { deleteTask, update, create, get };
