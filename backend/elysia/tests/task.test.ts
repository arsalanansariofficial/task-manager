import { beforeEach, afterAll, describe, expect, test } from 'bun:test';
import { StatusMap } from 'elysia';

import {
  getSessionCookie,
  kevinsTasks,
  resetDisk,
  setupDb,
  resetDb,
  gwen,
  api,
  ben
} from '@/tests/fixtures/db';
import { type SchemaSelect, Status } from '@/lib/db/schema';
import { ctx } from '@/lib/auth';
import { db } from '@/lib/db';

describe('tests for task resource', () => {
  afterAll(async () => Promise.all([resetDb(), resetDisk()]));
  beforeEach(setupDb);

  test('should create task for user', async () => {
    const headers = await ctx.getAuthHeaders({ userId: gwen.id });
    const { status, data } = await api.tasks.post(
      { title: 'Work with Charm Caster' },
      getSessionCookie(headers)
    );

    const task = await db.query.task.findFirst({ where: { id: data?.id } });
    expect(task?.status).toBe(Status.incomplete);
    expect(status).toBe(StatusMap.OK);
    expect(task).not.toBeNull();
  });

  test('ben should not delete task created by kevin', async () => {
    const headers = await ctx.getAuthHeaders({ userId: ben.id });
    const [$task] = kevinsTasks as [SchemaSelect['task']];

    const { status } = await api
      .tasks({ id: $task.id })
      .delete(undefined, getSessionCookie(headers));
    expect(status).toBe(StatusMap['Bad Request']);

    const task = await db.query.task.findFirst({ where: { id: $task.id } });
    expect(task).not.toBeUndefined();
  });

  test('should fetch tasks for user', async () => {
    const headers = await ctx.getAuthHeaders({ userId: gwen.id });
    const { status, data } = await api.tasks.get(getSessionCookie(headers));
    expect(status).toBe(StatusMap.OK);
    expect(data?.length).toBe(1);
  });
});
